"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, MessageSquare } from "lucide-react";

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
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger className="feedback-trigger">
                <MessageSquare size={16} />
                Feedback
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="dialog-overlay" />
                <DialogPrimitive.Content className="dialog-content">
                    <div className="dialog-header">
                        <DialogPrimitive.Title className="dialog-title">
                            Send Feedback
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="dialog-description">
                            Have a suggestion or found a bug? Let us know!
                        </DialogPrimitive.Description>
                        <DialogPrimitive.Close className="dialog-close">
                            <X size={16} />
                        </DialogPrimitive.Close>
                    </div>

                    {isSuccess ? (
                        <div className="feedback-success">
                            <p>🎉 Thank you! Your feedback has been sent.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="feedback-form">
                            {/* Web3Forms Access Key */}
                            <input type="hidden" name="access_key" value="d71f712d-1213-4e0a-b6a3-1b50ef9c757a" />

                            <div className="form-group">
                                <label htmlFor="email">Email <span className="text-muted">(Optional, if you want a reply)</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    required
                                    placeholder="Tell us what you think..."
                                    className="form-textarea"
                                    rows={4}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={isSubmitting} className="form-submit">
                                    {isSubmitting ? "Sending..." : "Send Feedback"}
                                </button>
                            </div>
                        </form>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
