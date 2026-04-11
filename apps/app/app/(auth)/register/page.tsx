import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 bg-[#151c2f] rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                    </div>
                    <h1 className="text-2xl font-black text-white">Create an Account</h1>
                    <p className="text-gray-400 text-sm mt-2">Start your TrendForge AI journey</p>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-400 text-sm text-center">Registration is currently invite-only or handled via Google/GitHub OAuth on the login page.</p>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
