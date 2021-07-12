import React, { useEffect, useRef, useState } from 'react';
import { useSprings, useSpring, a } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';

const data = [
  { title: 'Big Sup', background: '#754533', image: '/0.jpg' },
  { title: 'Pikes Peak ', background: '#354046', image: '/1.jpg' },
  { title: 'Tail of the Dragon', background: '#6F4623', image: '/2.jpg' },
  { title: 'Route 26 Loop', background: '#333c45', image: '/3.jpg' },
  { title: 'Route 348', background: '#2B3815', image: '/4.jpg' },
];

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

const TOTAL_ITEMS = data.length;
const ITEM_GAP = 267;
const SLIDER_WIDTH = 248;
const SLIDER_HEIGHT = 417;
const TITLE_FONT_SIZE_DETAILS = 32;
const TITLE_FONT_SIZE_SLIDER = 18;

export default function Layot() {
  const containerRef = useRef(null);

  const [detailsView, setDetailsView] = useState(false);
  const [stylesSpring, stylesSpringApi] = useSpring(() => ({
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    fontSize: TITLE_FONT_SIZE_SLIDER,
    pt: 16,
    pl: 16,
    headerOpacity: 0,
    navDetailsOpacity: 0,
    navDetailsTop: 120,
  }));

  const [backdropStyle, backdropStyleApi] = useSpring(() => ({
    background: data[1].background,
  }));

  const selectedItem = useRef(1);
  const [springs, api] = useSprings(TOTAL_ITEMS, (index) => ({
    x: ITEM_GAP * index - ITEM_GAP * selectedItem.current,
  }));

  const activateNext = (x) => {
    selectedItem.current = clamp(
      selectedItem.current + (x > 0 ? -1 : 1),
      0,
      TOTAL_ITEMS - 1,
    );
  };

  const moveItems = (active, x) => {
    api.start((index) => {
      const root = ITEM_GAP * index - ITEM_GAP * selectedItem.current;
      return {
        x: active ? x + root : root,
      };
    });

    backdropStyleApi({
      background: data[selectedItem.current].background,
    });
  };

  const onExpand = () => {
    const { width, height } = containerRef.current.getBoundingClientRect();
    api.start((index) => {
      const root = ITEM_GAP * index * 3 - ITEM_GAP * 3 * selectedItem.current;
      return {
        x: root,
      };
    });

    stylesSpringApi({
      width: width + 4,
      height: height + 4,
      fontSize: TITLE_FONT_SIZE_DETAILS,
      pt: 64,
      pl: 32,
      headerOpacity: 0.7,
      navDetailsOpacity: 1,
      navDetailsTop: 0,
    });
  };
  const onCollapse = () => {
    api.start((index) => {
      const root = ITEM_GAP * index - ITEM_GAP * selectedItem.current;
      return {
        x: root,
      };
    });

    stylesSpringApi({
      width: SLIDER_WIDTH,
      height: SLIDER_HEIGHT,
      fontSize: TITLE_FONT_SIZE_SLIDER,
      pt: 16,
      pl: 16,
      headerOpacity: 0,
      navDetailsOpacity: 0,
      navDetailsTop: 120,
    });
  };

  const bind = useDrag(({ active, movement: [x], tap, cancel }) => {
    if (!detailsView) {
      if (!tap) {
        if (active && Math.abs(x) > 50) {
          activateNext(x);
          cancel();
        }
        moveItems(active, x);
      } else {
        setDetailsView(true);
      }
    }
  });

  useEffect(() => {
    if (detailsView) {
      onExpand();
    } else {
      onCollapse();
    }
  }, [detailsView]);

  return (
    <div className="layout" ref={containerRef}>
      <div className="header">
        <a.div
          className="flex pr-4  text-white text-2xl"
          style={{ opacity: stylesSpring.headerOpacity }}
        >
          <button
            className="icon-back outline-none focus:outline-none  p-4"
            onClick={() => {
              setDetailsView(false);
            }}
            type="button"
          />
          <button className="ml-8 icon-upload" />
          <div className="flex-grow" />
          <button className="icon-heart" />
        </a.div>
      </div>
      <div className="content relative">
        <a.div className="pl-10 pt-16 backdrop" style={backdropStyle}>
          <div className="flex items-center">
            <div className="font-bold text-4xl text-title-main">Roads</div>
            <div className="ml-4 font-semibold text-lg text-title-sub">
              Mountains
            </div>
          </div>
          <div className="flex items-center text-title-main">
            <div className="font-semibold text-lg">USA</div>
            <div className="ml-2 icon-expand " />
          </div>
        </a.div>
        <div className="absolute transform-self-center">
          <a.div
            className="relative disable-select"
            {...bind()}
            style={{ width: stylesSpring.width, height: stylesSpring.height }}
          >
            {springs.map((styles, index) => (
              <a.div
                className="absolute inset-0 flex flex-col justify-between bg-no-repeat bg-cover bg-center shadow"
                style={{
                  ...styles,
                  backgroundImage: `url("${data[index].image}")`,
                }}
                key={index} // list is not dynamic
              >
                <a.div
                  className="text-white font-medium"
                  style={{
                    fontSize: stylesSpring.fontSize,
                    paddingTop: stylesSpring.pt,
                    paddingLeft: stylesSpring.pl,
                  }}
                >
                  {data[index].title}
                </a.div>
                <div className="h-12 flex justify-center items-center uppercase bg-details">
                  Details
                </div>
              </a.div>
            ))}
          </a.div>
        </div>
      </div>
      <div className="nav relative">
        <div className="flex items-end justify-around absolute text-2xl pb-8 inset-0">
          <div className="icon-map" />
          <div className="icon-compass" />
          <div className="icon-message" />
          <div className="icon-user" />
        </div>

        <a.div
          className="absolute bg-details inset-0"
          style={{
            opacity: stylesSpring.navDetailsOpacity,
          }}
        />
        <a.div
          className="absolute rounded-full flex items-center justify-center bg-white text-gray-900 w-12 h-12 transform-self-top-center"
          style={{
            opacity: stylesSpring.navDetailsOpacity,
          }}
        >
          <div className="icon-play" />
        </a.div>

        <a.div
          className="flex items-center justify-around absolute inset-0"
          style={{
            y: stylesSpring.navDetailsTop,
          }}
        >
          <div className="">
            <div className="text-white font-medium">2:23:12</div>
            <div className="text-sm mt-1">BEST TIME</div>
          </div>
          <div className="text-center w-32">
            <div className="text-white font-medium separator">657 km</div>
            <div className="text-sm mt-1">DISTANCE</div>
          </div>
          <div className="">
            <div className="text-white font-medium">1244 m</div>
            <div className="text-sm mt-1 ">ALTITIDE</div>
          </div>
        </a.div>
      </div>
    </div>
  );
}
