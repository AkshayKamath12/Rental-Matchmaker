import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';

interface CurrentChatProps {
    user: String;
    otherUser: String;
}

interface ChatMessage {
    id?: number;
    fromUser: String;
    toUser: String;
    content: String;
    timestamp?: Date;
}



export default function CurrentChat({user, otherUser}: CurrentChatProps) {
    const clientRef = useRef<Client | null>(null);
    const messageRef = useRef<HTMLTextAreaElement | null>(null);
    const [chatHistoryDisplay, setChatHistoryDisplay] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    

    const fetchChatsWithOtherUser = async (otherUser: String) => {
        const response = await fetch(`http://localhost:8080/api/chats/chatHistory/${otherUser}`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const { data: chatHistory, isLoading, isError } = useQuery({
        queryKey: ['chatHistory', otherUser],
        queryFn: () => fetchChatsWithOtherUser(otherUser),
    });

    useEffect(() => {
        if (chatHistory){ 
            setChatHistoryDisplay(chatHistory);
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
            } 
        };
    }, [chatHistory]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistoryDisplay]);


    useEffect(() => {
        const jwtToken = getCookie("jwt-token");
        const socket = new SockJS(`http://localhost:8080/ws?token=${jwtToken}`);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onWebSocketError: (evt) => {
                console.error('WebSocket error:', evt);
            }
        });

        client.onConnect = (frame) => {
            console.log('Connected: ', frame);
            client.subscribe(`/user/${user}/queue/reply`, (message) => {
                const newMessage = JSON.parse(message.body);
                const savedMessage = {
                    fromUser: newMessage.sender,
                    toUser: newMessage.recipient,
                    content: newMessage.content,
                }
                console.log('New message received: ', savedMessage);
                setChatHistoryDisplay(prev => [...prev, newMessage]);
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error: ', frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };

    }, []);

    const sendMessage = () => {
        if (clientRef.current && clientRef.current.connected) {
            const messageContent = messageRef.current?.value.trim();
            if (!messageContent) {
                console.error('Message content cannot be empty');
                return;
            }
            messageRef.current!.value = ''; 
            const message = {
                sender: user,
                recipient: otherUser,
                content: messageContent,
            };
            clientRef.current.publish({
                destination: '/app/private',
                body: JSON.stringify(message),
            });
            console.log(`Message sent to ${otherUser}: `, messageContent);
            setChatHistoryDisplay(prev => [...prev, { fromUser: user, toUser: otherUser, content: messageContent }]);
        } else {
            console.error('WebSocket is not connected');
        }
    }

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
            <div className="flex flex-col p-4 overflow-y-scroll h-[50vh]">
                {chatHistoryDisplay && chatHistoryDisplay.map((message: ChatMessage) => (
                    <div className={`mb-4 ${message.fromUser != user ? "text-left" : "text-right"}`} key={message.id}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${message.fromUser == user ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} className="h-0" />{ /* This empty div is used to scroll to the bottom of the chat history */}
                
            </div>
            <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
                rows={3}
                ref={messageRef}
            />
            <button
                onClick={sendMessage}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Send
            </button>
        </div>
    );

}