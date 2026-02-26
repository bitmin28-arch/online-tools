"use client";

import * as React from "react";

/**
 * 反馈弹窗组件
 * 不依赖 Radix UI Portal，直接用原生 state + fixed 定位实现
 * 通过 Web3Forms API 将用户反馈发送到指定邮箱
 */
export function FeedbackDialog() {
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="feedback-trigger"
                onClick={() => setOpen(true)}
            >
                💬 Feedback
            </button>

            {open && (
                <>
                    {/* 遮罩层 */}
                    <div
                        className="dialog-overlay"
                        onClick={() => setOpen(false)}
                    />
                    {/* 弹窗主体 */}
                    <div className="dialog-content">
                        <div className="dialog-header">
                            <h2 className="dialog-title">Send Feedback</h2>
                            <p className="dialog-description">
                                Have a suggestion or found a bug? Let us know!
                            </p>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="feedback-success">
                                <p>🎉 Thank you! Your feedback has been sent.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="feedback-form">
                                <input type="hidden" name="access_key" value="d71f712d-1213-4e0a-b6a3-1b50ef9c757a" />

                                <div className="form-group">
                                    <label htmlFor="feedback-email">
                                        Email <span className="text-muted">(Optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="feedback-email"
                                        placeholder="your@email.com"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="feedback-message">Message</label>
                                    <textarea
                                        name="message"
                                        id="feedback-message"
                                        required
                                        placeholder="Tell us what you think..."
                                        className="form-textarea"
                                        rows={4}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="form-submit"
                                >
                                    {isSubmitting ? "Sending..." : "Send Feedback"}
                                </button>
                            </form>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
