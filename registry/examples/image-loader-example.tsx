import { ImageGenerationLoader } from "../components/image-loader"

function ImageLoaderExample() {
  const imageUrl = "https://images.unsplash.com/photo-1620694563886-c3a80ec55f41"
  const loaderText = "YELLOW BIRD"

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="relative w-fit max-w-full overflow-hidden rounded-lg bg-background shadow-xl">
        <img
          src={imageUrl}
          alt="Preview"
          className="block max-h-[400px] w-full max-w-2xl object-cover sm:max-h-[500px] lg:max-h-[600px]"
          crossOrigin="anonymous"
        />
        <ImageGenerationLoader
          key={`${imageUrl}-${loaderText}`}
          text={loaderText}
          effect="scale-wave"
        />
      </div>
    </div>
  )
}

export default ImageLoaderExample
