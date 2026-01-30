import { getDailyQuiz } from '@/actions/game';
import QuizGame from '@/components/quiz/QuizGame';

export const metadata = {
    title: 'Quiz du Jour | Faunapedia',
    description: 'Teste tes connaissances sur la faune sauvage et gagne des points !',
};

export default async function QuizPage() {
    const questions = await getDailyQuiz();

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950/20">
            {/* Header */}
            <section className="relative overflow-hidden py-16">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                        <span className="text-lg">🧠</span>
                        Quiz du Jour
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
                        Teste tes connaissances !
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Réponds aux questions sur la faune sauvage pour gagner des points et débloquer des badges.
                    </p>
                </div>
            </section>

            {/* Quiz Section */}
            <section className="mx-auto max-w-7xl px-4 pb-16">
                <div className="flex justify-center">
                    <QuizGame questions={questions} />
                </div>
            </section>
        </main>
    );
}
