ALTER TABLE "assigned_tasks" DROP CONSTRAINT "assigned_tasks_task_id_tasks_task_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assigned_tasks" ADD CONSTRAINT "assigned_tasks_task_id_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("task_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
