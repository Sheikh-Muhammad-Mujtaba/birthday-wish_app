'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaBirthdayCake } from 'react-icons/fa';
import { GiBalloons } from 'react-icons/gi';
import useSound from 'use-sound';

// Dynamically import Confetti component to avoid server-side rendering issues 
const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false });

// Define color palettes for candles, balloons, and confetti 
const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '98D8C8'];
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '98D8C8'];
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '98D8C8', '#F7DC6F', '#BB8FCE'];

// {/* Define type for window size (for Confetti) */}
type ConfettiProps = {
    width: number;
    height: number;
};

export default function BirthdayWish() {
    // {/* State to manage the number of lit candles, popped balloons, confetti visibility, window size, and celebration status */}
    const [candlesLit, setCandlesLit] = useState<number>(0);
    const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 });
    const [celebrating, setCelebrating] = useState<boolean>(false);

    // {/* State to manage the selected sound file for the celebration */}
    const [selectedSound, setSelectedSound] = useState<string>('/sounds/confetti.mp3');

    // {/* Hook to play sound and stop it, with a callback to stop confetti when the sound ends */}
    const [playSound, { stop }] = useSound(selectedSound, { 
        interrupt: true,
        onend: () => {
            setShowConfetti(false); //{/* Stop confetti when the sound ends */}
        }    
    });

   // {/* Update confetti state and stop sound whenever the selected sound changes */}
    useEffect(() => {
        stop(); // {/* Stop any previously playing sound */}
        setShowConfetti(false); // {/* Ensure confetti stops if the sound is manually stopped */}
    }, [selectedSound, stop]);

//    {/* Total number of candles and balloons */}
    const totalCandles = 5;
    const totalBalloons = 5;

    // {/* Effect to handle window resize for confetti dimensions */}
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        handleResize(); //{/* Initial call to set window size */}
        window.addEventListener('resize', handleResize); //{/* Add event listener for window resize */}
        return () => window.removeEventListener('resize', handleResize); //{/* Cleanup on component unmount */}
    }, []);

    // {/* Function to handle the celebration logic (lighting candles, popping balloons, playing sound) */}
    const celebrate = () => {
        setCelebrating(true);
        setShowConfetti(true);

        stop(); //{/* Stop any previous sound */}
        playSound(); //{/* Play the selected sound */}

        //{/* Light candles one by one */}
        const candleInterval = setInterval(() => {
            setCandlesLit((prev) => {
                if (prev < totalCandles) return prev + 1;
                clearInterval(candleInterval); //{/* Clear interval once all candles are lit */}
                return prev;
            });
        }, 500);

       // {/* Pop balloons one by one after candles are lit */}
        const balloonInterval = setTimeout(() => {
            const balloonPopInterval = setInterval(() => {
                setBalloonsPoppedCount((prev) => {
                    if (prev < totalBalloons) return prev + 1;
                    clearInterval(balloonPopInterval); //{/* Clear interval once all balloons are popped */}
                    return prev;
                });
            }, 500);
        }, totalCandles * 500); //{/* Delay balloon popping until candles are lit */}
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} //{/* Initial animation state */}
                animate={{ scale: 1, opacity: 1 }} //{/* Animation state on render */}
                transition={{ duration: 0.5 }} //{/* Animation duration */}
                className="w-full max-w-md"
            >
                <Card className="mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border-2 border-black">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold text-black">Happy 20th Birthday!</CardTitle>
                        <CardDescription className="text-2xl font-semibold text-gray-600">
                            Sorry for the late wish Sir Asharib
                        </CardDescription>
                        <p className="text-lg text-gray-500">September 4th</p>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div>
                            <h3 className="text-lg font-semibold text-black mb-2">Select Sound:</h3>
                            <select
                                value={selectedSound}
                                onChange={(e) => setSelectedSound(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="/sounds/confetti.mp3">Birthday Song</option>
                                <option value="/sounds/candle-light.mp3">Cheering</option>
                                <option value="/sounds/balloon-pop.mp3">Birthday Wish</option>
                            </select>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-black mb-2">Light the candles:</h3>
                            <div className="flex justify-center space-x-2">
                                {[...Array(totalCandles)].map((_, index) => (
                                    <AnimatePresence key={index}>
                                        {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                                            <motion.div
                                                initial={{ scale: 0 }} //{/* Initial scale of the candle */}
                                                animate={{ scale: 1 }} //{/* Animate to full size */}
                                                exit={{ scale: 0 }} //{/* Exit animation */}
                                                transition={{ duration: 0.5, delay: celebrating ? index * 0.5 : 0 }} //{/* Delayed animation for each candle */}
                                            >
                                                <FaBirthdayCake
                                                    className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                                    style={{ color: candleColors[index % candleColors.length] }} //{/* Assign color to each candle */}
                                                />
                                            </motion.div>
                                        ) : (
                                            <FaBirthdayCake
                                                className={`w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                            />
                                        )}
                                    </AnimatePresence>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-black mb-2">Pop the balloons:</h3>
                            <div className="flex justify-center space-x-2">
                                {[...Array(totalBalloons)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 1 }} //{/* Initial scale of the balloon */}
                                        animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }} //{/* Animate balloon popping */}
                                        transition={{ duration: 0.5, delay: index * 0.5 }} //{/* Delayed animation for each balloon */}
                                    >
                                        <GiBalloons
                                            className={`w-8 h-8 cursor-pointer hover:scale-110`}
                                            style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }} //{/* Assign color to each balloon */}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg shadow-lg"
                            onClick={celebrate}
                        >
                            Celebrate!
                        </Button>
                    </CardFooter>
                </Card>
                {showConfetti && (
                    <DynamicConfetti
                        width={windowSize.width}
                        height={windowSize.height}
                        colors={confettiColors}
                    />
                )}
            </motion.div>
        </div>
    );
}
