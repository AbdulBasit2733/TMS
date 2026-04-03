import { TaskDetailClient } from "@/components/tasks/TaskDetailClient";


export default function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <TaskDetailClient taskId={params.id} />;
}