import bg from "../assets/cloud.jpg"

const LoadingScreen = () => {
    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="bg-white/20 backdrop-blur-md border border-white/30 p-10 rounded-lg shadow-lg flex flex-col items-center gap-5">
                
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-800 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-3 h-3 rounded-full bg-gray-800 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-3 h-3 rounded-full bg-gray-800 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-lg font-bold text-gray-800">Verifying session</h1>
                    <p className="text-xs text-gray-500">Please wait a moment...</p>
                </div>

            </div>
        </div>
    )
}

export default LoadingScreen