import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('army_officer'),
  rank: text('rank'),
  unit: text('unit'),
  serviceNumber: text('service_number'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const officers = pgTable('officers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  rank: text('rank').notNull(),
  unit: text('unit').notNull(),
  serviceNumber: text('service_number').notNull(),
  currentStressScore: integer('current_stress_score').notNull().default(50),
  zone: text('zone').notNull().default('medium'),
  primaryStressDriver: text('primary_stress_driver'),
  sleepHoursAvg: real('sleep_hours_avg').default(7.0),
  assessmentHistory: jsonb('assessment_history'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  officerId: text('officer_id').notNull(),
  userUid: text('user_uid'),
  score: integer('score').notNull(),
  zone: text('zone').notNull(),
  answers: jsonb('answers'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, {
    fields: [assessments.userUid],
    references: [users.uid],
  }),
}));
