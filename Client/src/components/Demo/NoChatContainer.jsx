import chatIcon from '../../assets/chatIcon.gif';
import TrueFocus from '../ui/TextAnimations/TrueFocus/TrueFocus';


const NoChatContainer = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center w-2/3 h-full text-white ">
            {/* <div className='bg-white/5 backdrop:filter backdrop-blur-lg rounded-3xl p-5 py-10 m-10 border border-white/10'> */}
            <TrueFocus 
                
                sentence="Ready to spice things up? Start chatting now!"
                manualMode={false}
                blurAmount={10}
                borderColor="red"
                animationDuration={1}
                pauseBetweenAnimations={0}
               
            />
            {/* </div> */}
        </div>
    );
};

export default NoChatContainer;
