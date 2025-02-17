import chatIcon from '../../assets/chatIcon.gif';

const NoChatContainer = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center w-full h-full text-white ">
            <img
                src={chatIcon}
                alt="Chat Icon"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-bounce"
            />
            <h2 className="md:text-3xl lg:text-4xl font-semibold mt-6 drop-shadow-lg tracking-wide">
                Welcome to Converse
            </h2>
            <p className="text-white/50 sm:text-sm md:text-lg  max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
                Select a chat to start messaging
            </p>
        </div>
    );
};

export default NoChatContainer;
