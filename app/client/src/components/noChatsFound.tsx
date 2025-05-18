export default function NoChatsFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">No Chats Found</h1>
            <p className="text-gray-600">You have no chats yet. Fill out the form and connect with your matches!</p>
        </div>
    );
}