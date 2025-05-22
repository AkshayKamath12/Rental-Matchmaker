import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { getCookie } from 'cookies-next';

interface CurrentChatProps {
    user: String;
    otherUser: String;
}


export default function CurrentChat({user, otherUser}: CurrentChatProps) {
    useEffect(() => {
        const jwtToken = getCookie("jwt-token");
        const socket = new SockJS(`http://localhost:8080/ws?token=${jwtToken}`);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = (frame) => {
            console.log('Connected: ', frame);
            client.subscribe('/user/queue/reply', (message) => {
                console.log('Received: ', message.body);
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error: ', frame);
        };

        client.activate();

        return () => {
            client.deactivate();
        };

    }, []);

    const messages = [
        { sender: "bob", text: "Hello!" },
        { sender: "alice", text: "Hi there!" },
        { sender: "bob", text: "How are you?" },
        { sender: "alice", text: "I'm good, thanks!" },]
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <h1 className="text-lg font-bold">{otherUser}</h1>
                <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.sender === user ? "text-right" : "text-left"}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${message.sender === user ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}