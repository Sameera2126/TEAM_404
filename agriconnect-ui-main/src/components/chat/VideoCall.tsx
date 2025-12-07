
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const APP_ID = '25566cb7acba4a4a89b9e37a74159df4'; // Provided by user
const CHANNEL = 'main'; // For now hardcoded or passed via props
const TOKEN = null; // Using null for testing mode (no security)

interface VideoCallProps {
    inCall: boolean;
    setInCall: (inCall: boolean) => void;
    channelName?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ inCall, setInCall, channelName = 'main' }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [start, setStart] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const client = useRef<IAgoraRTCClient | undefined>();
    const localAudioTrack = useRef<IMicrophoneAudioTrack | undefined>();
    const localVideoTrack = useRef<ICameraVideoTrack | undefined>();

    useEffect(() => {
        if (inCall) {
            initAgora();
        }

        return () => {
            // cleanup handled in leaveCall usually, but good to double check
            if (client.current) {
                // leaveCall(); 
                // We don't auto leave implicitly to avoid quick unmount issues, but useEffect cleanup is safe
            }
        };
    }, [inCall]);

    const initAgora = async () => {
        client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        client.current.on('user-published', async (user, mediaType) => {
            await client.current?.subscribe(user, mediaType);
            if (mediaType === 'video') {
                setUsers((prevUsers) => [...prevUsers, user]);
            }
            if (mediaType === 'audio') {
                user.audioTrack?.play();
            }
        });

        client.current.on('user-unpublished', (user, mediaType) => {
            if (mediaType === 'audio') {
                if (user.audioTrack) user.audioTrack.stop();
            }
            if (mediaType === 'video') {
                setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
            }
        });

        client.current.on('user-left', (user) => {
            setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
        });

        try {
            await client.current.join(APP_ID, channelName, TOKEN, null);
        } catch (error) {
            console.error("Failed to join channel:", error);
        }

        try {
            localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
            localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

            await client.current.publish([localAudioTrack.current, localVideoTrack.current]);
            setStart(true);
        } catch (error) {
            console.error("Failed to create/publish tracks:", error);
        }
    };

    const leaveCall = async () => {
        if (localAudioTrack.current) {
            localAudioTrack.current.stop();
            localAudioTrack.current.close();
        }
        if (localVideoTrack.current) {
            localVideoTrack.current.stop();
            localVideoTrack.current.close();
        }

        if (client.current) {
            await client.current.leave();
        }

        setInCall(false);
        setStart(false);
    };

    const toggleMic = async () => {
        if (localAudioTrack.current) {
            if (isMuted) {
                await localAudioTrack.current.setEnabled(true);
            } else {
                await localAudioTrack.current.setEnabled(false);
            }
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack.current) {
            if (isVideoOff) {
                await localVideoTrack.current.setEnabled(true);
            } else {
                await localVideoTrack.current.setEnabled(false);
            }
            setIsVideoOff(!isVideoOff);
        }
    };

    if (!inCall) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div className="flex-1 w-full max-w-6xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Local Video */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                    {start && localVideoTrack.current && (
                        <MediaPlayer videoTrack={localVideoTrack.current} audioTrack={undefined} />
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                        You
                    </div>
                </div>

                {/* Remote Videos */}
                {users.map((user) => (
                    <div key={user.uid} className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                        <MediaPlayer videoTrack={user.videoTrack} audioTrack={undefined} />
                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                            User {user.uid}
                        </div>
                    </div>
                ))}

                {users.length === 0 && start && (
                    <div className="flex items-center justify-center h-full text-white/50 bg-gray-900 rounded-2xl border border-gray-800">
                        Waiting for others to join...
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 w-full bg-gray-900/50 backdrop-blur-sm border-t border-white/10 flex justify-center gap-4">
                <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full w-14 h-14"
                    onClick={toggleMic}
                >
                    {isMuted ? <MicOff /> : <Mic />}
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
                    onClick={leaveCall}
                >
                    <PhoneOff />
                </Button>

                <Button
                    variant={isVideoOff ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full w-14 h-14"
                    onClick={toggleVideo}
                >
                    {isVideoOff ? <VideoOff /> : <Video />}
                </Button>
            </div>
        </div>
    );
};

const MediaPlayer = ({ videoTrack, audioTrack }: { videoTrack: ICameraVideoTrack | undefined, audioTrack: IMicrophoneAudioTrack | undefined }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        videoTrack?.play(container.current);
        return () => {
            videoTrack?.stop();
        };
    }, [container, videoTrack]);

    useEffect(() => {
        if (audioTrack) {
            audioTrack.play();
        }
        return () => {
            audioTrack?.stop();
        };
    }, [audioTrack]);

    return <div ref={container} className="w-full h-full" style={{ minHeight: '300px' }}></div>;
};

export default VideoCall;
