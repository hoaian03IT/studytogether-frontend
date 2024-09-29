import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";

function App() {
    const [isSpinning, setIsSpinning] = useState(false);
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-32">
            <h1 className={clsx("mt-36 text-3xl font-bold underline", isSpinning ? "animate-spinner-ease-spin" : "")}>
                Welcome to our project
            </h1>
            <Button className="w-200" onClick={() => setIsSpinning(!isSpinning)}>
                {!isSpinning ? "Click to spin" : "Stop it!!"}
            </Button>
        </div>
    );
}

export default App;
