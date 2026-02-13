import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversitySelector } from './components/UniversitySelector';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export function OnboardingPage() {
    const [university, setUniversity] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!university) return;
        setLoading(true);
        try {
            await api.patch('/profiles/onboarding', { universityName: university });
            // Hard reload or state update might be needed if useAuth heavily caches profile
            // For now, redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert("Failed to complete onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Unimarky! 🎓</CardTitle>
                        <CardDescription>
                            Where do you study? This helps us show you relevant listings and events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <UniversitySelector value={university} onChange={setUniversity} />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={!university || loading}
                        >
                            {loading ? "Saving..." : "Continue to Dashboard"}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
