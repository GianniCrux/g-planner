import Image from "next/image"


export const Loading = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <Image 
                src="/plannerLogo.svg"
                alt="logo"
                width={120}
                height={120}
                className="animate-pulse duration-700"
            />
        </div>
    )
}