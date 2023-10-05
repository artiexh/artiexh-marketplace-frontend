import clsx from "clsx";
import { Carousel } from "@mantine/carousel";
import { Campaign, Promotion } from "@/types/HomeBranding";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";

type HeroSectionProps = {
  className?: string;
  carouselElements: Campaign[];
  promotionElements: Promotion[];
};

export default function HeroSection({
  className,
  carouselElements,
  promotionElements,
}: HeroSectionProps) {
  return (
    <div className={clsx("hero-wrapper", className)}>
      <Carousel
        withControls={false}
        withIndicators
        classNames={{
          root: "w-full lg:w-3/4 lg:rounded-md",
          viewport: "h-full lg:rounded-md",
          container: "h-full lg:rounded-md",
          slide: "h-full",
          indicator: "bg-white",
        }}
      >
        {carouselElements.map((element) => (
          <Carousel.Slide key={element.id}>
            <div className="relative h-full">
              <Image
                src={element.url}
                fill
                className="object-cover"
                alt={element.id}
              />
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
      <div className="hidden lg:flex flex-col w-full gap-8 flex-1 ">
        {promotionElements.map((promotion) => (
          <div className="flex-1 relative rounded-md" key={promotion.id}>
            <ImageWithFallback
              fallback="/assets/default-thumbnail.jpg"
              src={promotion.url}
              fill
              alt={promotion.id}
              className="rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
