import { ShimmerText } from "../components/shimmer-text"

export default function ShimmerTextExample() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <ShimmerText
        speed={3.5}
        bevel={true}
        size="responsive"
        weight="extrabold"
      >
        KitonUi
      </ShimmerText>
    </div>
  )
}
