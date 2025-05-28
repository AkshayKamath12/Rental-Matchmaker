import { send } from "process";
import {useRef, useState} from "react";

export default function MatchMessageChatModal({matchUsername, closeModal, sendMessage}: { matchUsername: string, closeModal: () => void, sendMessage: (recipient: string, message: string) => void }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function sendMessageFromModal(){
        if (textareaRef.current) {
            console.log(`Sending message to ${matchUsername} with ${textareaRef.current.value}`);
            const message = textareaRef.current.value;
            sendMessage(matchUsername, message);
            textareaRef.current.value = ""; 
            closeModal(); 
        }
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold mb-4">Send {matchUsername} a message!</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >Close</button>
                </div>
                <textarea
                    className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-4"
                    placeholder="Type your message here..."
                    rows={4}
                    ref={textareaRef}
                ></textarea>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => {
                            sendMessageFromModal();
                            console.log(`Message sent to ${matchUsername}`);
                        }}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    )

};