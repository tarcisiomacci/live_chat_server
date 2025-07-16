import { and, eq, sql } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { audioChuncks } from '../../db/schema/audio-chuncks.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(3),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const embeddings = await generateEmbeddings(question)

      const embeddingsAsString = `[${embeddings.join(',')}]`

      const chunks = await db
        .select({
          id: schema.audioChuncks.id,
          transcription: schema.audioChuncks.transcription,
          similarity: sql<number>`1 - (${schema.audioChuncks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(audioChuncks)
        .where(
          and(
            eq(schema.audioChuncks.roomId, roomId),
            sql`1 - (${schema.audioChuncks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`${schema.audioChuncks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(3)

      let answer: string | null = null

      if (chunks.length > 0) {
        const transcription = chunks.map((chunk) => chunk.transcription)

        answer = await generateAnswer(question, transcription)
      }

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
          answer,
        })
        .returning()

      const inserted = result[0]

      if (!inserted) {
        throw new Error('Failed to create new question')
      }

      return reply.status(201).send({ questionId: inserted.id, answer })
    }
  )
}
