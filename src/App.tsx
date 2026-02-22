import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import TasksCrud from "./components/TasksCrud";
import { supabase } from "./supabase-client";

function App() {
  const [session, setSession] = useState<any>(null);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    console.log("session data************ ", data.session);

    setSession(data.session);
  };
  console.log("session data************ ", session);

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    console.log("checkign listner data ********** ", authListener);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log("error while signing out********* ", error);
  }

  return (
    <>
      {session && (
        <div>
          <button
            onClick={signOut}
            className="cursor-pointer border-white border px-2 rounded-2xl"
          >
            Sign Out
          </button>
        </div>
      )}
      {session ? <TasksCrud /> : <Auth />}
    </>
  );
}

export default App;
