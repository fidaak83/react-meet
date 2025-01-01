import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useSearchParams } from 'react-router-dom';

function Home() {
  const [searchParams] = useSearchParams();
  // console.log(searchParams);

  // const id = searchParams.get('edit');
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  // Add TURN server configuration
  const peerConfig = {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Google's STUN server
      ]
    }
  };

  useEffect(() => {
    const peer = new Peer(peerConfig);

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        call.answer(mediaStream);
        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <div className="w-full  bg-slate-900 flex flex-col items-center justify-center">
      <div className='bg-gray-200 rounded-lg p-6'>
      <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Join Room</label>
            <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Room ID" required />
        </div>
        <button type="button" onClick={() => call(remotePeerIdValue)} class="text-white w-full mt-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Join</button>
        <button type="button" onClick={() => call(remotePeerIdValue)} class="text-white w-full mt-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Copy </button>
        <p className='text-slate-600 text-sm font-semibold'>Your Room ID:</p>
        <p className='text-slate-400 text-xs'>{peerId}</p>
      </div>

      <div>
        <video ref={currentUserVideoRef} muted />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
}

export default Home;
