import { useState } from "react"

export const Home = () => {
    const [count, setCount] = useState<number>(0);

    return (
        <div className="home">
            <h1>Welcome Home!</h1>
            <h2>Count: {count}</h2>
            <button onClick={() => setCount(count => count + 1)}>+</button>
            <button onClick={() => setCount(count => count - 1)}>-</button>
        </div>
    )
}