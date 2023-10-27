import { Carousel, CarouselStylesNames } from "@mantine/carousel";

type PreviewListProps = {
  data: any[];
  render: (item: any) => JSX.Element;
  classNames?: Partial<Record<CarouselStylesNames, string>>;
};

export default function PreviewList({
  data,
  render,
  classNames,
}: PreviewListProps) {
  return (
    <div className="preview-list-wrapper w-full">
      <Carousel
        className="w-[1280px] lg:w-full flex"
        align="start"
        slideSize="fit-content"
        classNames={classNames}
      >
        {data.map((item, index) => (
          <Carousel.Slide key={index}>{render(item)}</Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
}
