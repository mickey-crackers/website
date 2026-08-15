"use client";
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, App } from 'antd';
import { db } from '../../../db';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Logo from '../../assets/mickey-logo.png';
import Bg from '../../assets/cracker-bg.svg';
import { useAuthStore } from '../../store/authStore/index';
import { FiLock, FiLogIn } from 'react-icons/fi';

const SuperAdminLogin = () => {
    const router = useRouter();
    const { message } = App.useApp();
    const { setAuthenticateSuccess } = useAuthStore();
    const [loading, setLoading] = useState(false);

    // Rate Limiting States
    const [attempts, setAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0);

    // 1. Initialise Rate Limit Checks
    useEffect(() => {
        const savedAttempts = Number(localStorage.getItem('admin_login_attempts') || '0');
        const savedLockoutUntil = Number(localStorage.getItem('admin_lockout_until') || '0');

        if (savedLockoutUntil > Date.now()) {
            const remaining = Math.ceil((savedLockoutUntil - Date.now()) / 1000);
            setLockoutTime(remaining);
            setAttempts(savedAttempts);
        } else if (savedLockoutUntil > 0) {
            // Lockout period has elapsed, clear storage
            localStorage.removeItem('admin_lockout_until');
            localStorage.setItem('admin_login_attempts', '0');
            setAttempts(0);
        } else {
            setAttempts(savedAttempts);
        }
    }, []);

    // 2. Countdown Timer Effect
    useEffect(() => {
        if (lockoutTime <= 0) return;
        const timer = setInterval(() => {
            setLockoutTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    localStorage.removeItem('admin_lockout_until');
                    localStorage.setItem('admin_login_attempts', '0');
                    setAttempts(0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [lockoutTime]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleLogin = async (values) => {
        if (lockoutTime > 0) {
            message.error(`Too many attempts. Account locked. Try again in ${lockoutTime} seconds.`);
            return;
        }

        const passcodeText = values.passcode?.trim();
        if (!passcodeText) {
            message.error("Please enter passcode");
            return;
        }

        setLoading(true);
        try {
            const passcodesRef = collection(db, 'passcodes');
            const q = query(passcodesRef, where('passcode', '==', passcodeText));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                const nextAttempts = attempts + 1;
                setAttempts(nextAttempts);
                localStorage.setItem('admin_login_attempts', String(nextAttempts));

                if (nextAttempts >= 5) {
                    const lockDuration = 5 * 60 * 1000; // 5 minutes lockout
                    const until = Date.now() + lockDuration;
                    localStorage.setItem('admin_lockout_until', String(until));
                    setLockoutTime(5 * 60);
                    message.error("Too many failed attempts. Account locked for 5 minutes.");
                } else {
                    message.error(`Access Denied: Invalid passcode. (Attempt ${nextAttempts} of 5)`);
                }
                setLoading(false);
                return;
            }

            // Successful Login
            localStorage.removeItem('admin_lockout_until');
            localStorage.setItem('admin_login_attempts', '0');
            setAttempts(0);

            const docData = snapshot.docs[0].data();
            const loggedUser = {
                uid: snapshot.docs[0].id,
                email: `${docData.name.toLowerCase().replace(/\s+/g, '')}@mickeycrackers.com`,
                displayName: docData.name,
                role: docData.role || 'Salesman'
            };

            setAuthenticateSuccess(loggedUser);
            message.success(`Logged in as ${docData.name} (${docData.role})`);
            router.push('/dashboard');
        } catch (error) {
            console.error("Login authentication error:", error);
            message.error("An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 py-6 bg-cover bg-center select-none bg-[#0a0a0a]"
            style={{
                backgroundImage: `radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_65%), url(${Bg.src || Bg})`
            }}
        >
            <Card
                variant="borderless"
                className="shadow-2xl rounded-3xl max-w-md w-full p-4 sm:p-6 !bg-[#121212]/90 backdrop-blur-md border border-neutral-900"
            >
                <div className="text-center mb-6">
                    <img
                        src={Logo.src || Logo}
                        alt="Mickey Crackers Sivakasi"
                        className="w-24 mx-auto mb-4 rounded-xl shadow-lg border border-[#D4AF37]/20"
                    />
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1 uppercase">
                        Admin <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Portal</span>
                    </h2>
                    <p className="text-gray-400 text-xs">Enter your secure passcode to access the workspace</p>
                </div>

                {lockoutTime > 0 && (
                    <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 text-center text-xs text-red-400 font-semibold mb-4 animate-pulse">
                        ⚠️ Too many failed attempts. Locked out for {formatTime(lockoutTime)}
                    </div>
                )}

                <Form layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                        name="passcode"
                        rules={[{ required: true, message: 'Please enter your access passcode' }]}
                    >
                        <Input.Password
                            prefix={<FiLock className="text-gray-400 mr-2" />}
                            placeholder="Enter access passcode"
                            size="large"
                            className="rounded-xl !bg-neutral-950 !border-neutral-800 focus:!border-[#D4AF37] !text-white hover:!border-[#D4AF37]/50"
                            maxLength={16}
                            disabled={lockoutTime > 0}
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            block
                            icon={<FiLogIn />}
                            disabled={lockoutTime > 0}
                            className="rounded-xl !bg-gradient-to-r !from-[#D4AF37] !to-[#AA7C11] hover:brightness-110 !text-black border-0 h-[46px] text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Authorize & Enter
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-6">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                        🔐 Protected Workspace
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminLogin;
