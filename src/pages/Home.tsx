import { FormEvent, useState } from 'react';
import { useHistory } from "react-router-dom";

import { illustrationImg, logoImg, googleImg } from '../assets/images/'
import { Button } from '../components/Button'

import '../styles/auth.scss'

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Toaster, toast } from 'react-hot-toast';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            toast.error('Código da sala vazio.');
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toast.error('Sala inexistente, verifique se o código digitado é válido.');
            return;
        }

        if (roomRef.val().endedAt) {
            toast.error('Sala fechada.');
            return;
        }


        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <Toaster />
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleImg} alt="Logo do google"></img>
                        Crie sua sala com o google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder="Digite o código da sala" onChange={event =>
                            setRoomCode(event.target.value)}
                            value={roomCode} />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}