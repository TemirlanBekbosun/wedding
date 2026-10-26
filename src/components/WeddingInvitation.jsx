import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Camera,
  Check,
  GlassWater,
  Heart,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Users,
  Utensils,
  Gem,
} from "lucide-react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import Patr from "../assets/patr2.jpg";
import Patrthree from "../assets/patr3.jpg";
import Patrfour from "../assets/patr4.jpg";
import { toast } from "react-toastify";
import { axiosInstance } from "../configs/axiosInstanse";

// Отсчёт идёт до начала сбора гостей — 21 ноября 2026 года, 15:00 (Каракол, UTC+6).
const WEDDING_DATE = new Date("2026-11-21T15:00:00+06:00");
const WEDDING_MAP_URL = "https://2gis.kg/karakol/firm/70000001027946380";

const events = [
  {
    time: "15:00",
    title: "Сбор гостей",
    description:
      "Будем рады встретить вас, обняться и сделать первые фотографии этого дня.",
    Icon: GlassWater,
  },
  {
    time: "16:00",
    title: "Начало торжества",
    description:
      "Начинается наш особенный вечер — с тёплых слов, улыбок и близких рядом.",
    Icon: Sparkles,
  },
  {
    time: "17:00",
    title: "Бракосочетание",
    description:
      "Самый трогательный момент — день, когда мы скажем друг другу главное «Да».",
    Icon: Gem,
  },
  {
    time: "17:30",
    title: "Праздничный банкет",
    description:
      "Поздравления, вкусная еда, музыка и танцы в кругу наших родных и друзей.",
    Icon: Utensils,
  },
  {
    time: "20:00",
    title: "Свадебный торт",
    description:
      "Разделим сладкий момент, выпьем чаю и сохраним ещё одно воспоминание вместе.",
    Icon: Camera,
  },
];

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Great+Vibes&display=swap');

  :root {
    color-scheme: light;
    --paper: #f5f1eb;
    --paper-deep: #e9e1d7;
    --ink: #272621;
    --muted: #777168;
    --gold: #a78b66;
    --gold-light: #d2bea0;
    --line: rgba(123, 101, 73, .35);
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 24px; }
  body {
    margin: 0;
    padding: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  button, input { font: inherit; }
  button { -webkit-tap-highlight-color: transparent; }
  ::selection { background: #d9c9b1; color: #25231f; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
  }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translate3d(0, 28px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;
const slowZoom = keyframes`
  from { transform: scale(1.06); }
  to { transform: scale(1); }
`;
const softPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;
const floatHeart = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
`;

const PageShell = styled.main`
  position: relative;
  width: 100%;
  overflow: clip;
  background:
    radial-gradient(
      ellipse at 5% 30%,
      rgba(219, 203, 180, 0.18),
      transparent 36%
    ),
    radial-gradient(
      ellipse at 95% 62%,
      rgba(199, 185, 164, 0.15),
      transparent 33%
    ),
    var(--paper);
`;

const OpeningScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  color: #fffdf8;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  background: #292720;
  opacity: ${({ $opened }) => ($opened ? 0 : 1)};
  visibility: ${({ $opened }) => ($opened ? "hidden" : "visible")};
  pointer-events: ${({ $opened }) => ($opened ? "none" : "auto")};
  transform: ${({ $opened }) => ($opened ? "scale(1.025)" : "scale(1)")};
  transition:
    opacity 850ms ease,
    transform 1200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    visibility 850ms;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${Patrfour});
    background-position: center;
    background-size: cover;
    opacity: 0.64;
    filter: saturate(0.55);
    animation: ${slowZoom} 5s ease-out both;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(18, 17, 14, 0.23),
      rgba(18, 17, 14, 0.68)
    );
  }
`;

const OpeningInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 560px);
  animation: ${fadeUp} 1.2s 0.15s both;
`;
const OpeningEyebrow = styled.p`
  margin: 0 0 22px;
  font-size: 10px;
  letter-spacing: 0.38em;
  line-height: 2;
  text-transform: uppercase;
`;
const OpeningNames = styled.div`
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(48px, 10vw, 90px);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;
const OpeningAmpersand = styled.div`
  margin: 8px 0 10px;
  color: #d7c19e;
  font-family: "Great Vibes", cursive;
  font-size: clamp(34px, 6vw, 52px);
  line-height: 1;
`;
const OpeningDate = styled.p`
  margin: 28px 0 35px;
  font-size: 11px;
  letter-spacing: 0.26em;
`;
const OpenInvitationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 21px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.04);
  color: #fffdf8;
  font-size: 10px;
  letter-spacing: 0.19em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;

  &:hover,
  &:focus-visible {
    background: #f8f3eb;
    color: #272621;
    border-color: #f8f3eb;
    outline: none;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`;

const MusicToggle = styled.button`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 1100;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(167, 139, 102, 0.7);
  border-radius: 50%;
  background: rgba(247, 243, 236, 0.92);
  color: var(--ink);
  box-shadow: 0 6px 24px rgba(30, 27, 22, 0.12);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease;
  &:hover {
    transform: translateY(-2px);
    background: #fffdf9;
  }
  &:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 3px;
  }
  @media (max-width: 520px) {
    right: 12px;
    bottom: 12px;
  }
`;

const HeroSection = styled.section`
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100svh;
  padding: 80px 24px 72px;
  overflow: hidden;
  background: #292720;
  color: #fffdf8;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${Patrfour});
    background-position: center;
    background-size: cover;
    opacity: 0.55;
    filter: saturate(0.55);
    animation: ${slowZoom} 2.2s ease-out both;
    transform: scale(1.02);
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(26, 24, 20, 0.26),
      rgba(26, 24, 20, 0.56) 70%,
      rgba(26, 24, 20, 0.78)
    );
  }
`;
const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 860px);
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(22px)"};
  transition:
    opacity 1s ease,
    transform 1s cubic-bezier(0.2, 0.7, 0.2, 1);
`;
const HeroEyebrow = styled.p`
  margin: 0 0 34px;
  font-size: 10px;
  letter-spacing: 0.42em;
  line-height: 2;
  text-transform: uppercase;
  @media (max-width: 520px) {
    letter-spacing: 0.25em;
    font-size: 9px;
  }
`;
const HeroTitle = styled.h1`
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-weight: 300;
  line-height: 0.84;
  letter-spacing: 0.09em;
  text-transform: uppercase;
`;
const HeroName = styled.span`
  display: block;
  font-size: clamp(57px, 11vw, 122px);
  animation: ${fadeUp} 1.1s both;
  &:last-child {
    animation-delay: 0.28s;
  }
`;
const HeroAnd = styled.span`
  display: block;
  margin: 12px 0 10px;
  color: #d4bd9b;
  font-family: "Great Vibes", cursive;
  font-size: clamp(42px, 6vw, 66px);
  line-height: 1;
  font-weight: 400;
  animation: ${softPulse} 3.5s ease-in-out infinite;
`;
const HeroRule = styled.div`
  width: 74px;
  height: 1px;
  margin: 32px auto 24px;
  background: #d1b895;
`;
const HeroDate = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.32em;
  line-height: 2.1;
  text-transform: uppercase;
  @media (max-width: 520px) {
    letter-spacing: 0.2em;
  }
`;
const HeroScroll = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 58px auto 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 253, 248, 0.9);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.25s ease;
  &:hover {
    color: #d8c29f;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Section = styled.section`
  position: relative;
  padding: clamp(78px, 10vw, 142px) 22px;
  scroll-margin-top: 20px;
  @media (max-width: 600px) {
    padding: 72px 18px;
  }
`;
const SectionInner = styled.div`
  width: min(100%, ${({ $maxWidth }) => $maxWidth || "1050px"});
  margin: 0 auto;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(26px)"};
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1);
`;
const SectionEyebrow = styled.p`
  margin: 0 0 18px;
  color: var(--gold);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.34em;
  text-align: center;
  text-transform: uppercase;
`;
const SectionTitle = styled.h2`
  margin: 0 auto;
  color: var(--ink);
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(39px, 5.6vw, 66px);
  font-weight: 300;
  line-height: 1.02;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.045em;
`;
const FineRule = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 28px auto;
  color: var(--gold);
  &::before,
  &::after {
    content: "";
    width: 42px;
    height: 1px;
    background: var(--line);
  }
  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
    stroke-width: 1;
  }
`;
const IntroSection = styled(Section)`
  background: var(--paper);
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    border: 1px solid rgba(167, 139, 102, 0.15);
    border-radius: 50%;
    pointer-events: none;
  }
  &::before {
    top: 34px;
    left: -115px;
  }
  &::after {
    right: -115px;
    bottom: 28px;
  }
`;
const IntroCopy = styled.p`
  max-width: 670px;
  margin: 0 auto;
  color: #4d4942;
  font-size: clamp(11px, 1.25vw, 13px);
  font-weight: 400;
  letter-spacing: 0.15em;
  line-height: 2.25;
  text-align: center;
  text-transform: uppercase;
  @media (max-width: 600px) {
    letter-spacing: 0.09em;
    line-height: 2.05;
  }
`;
const IntroSignature = styled.p`
  margin: 34px 0 0;
  color: var(--gold);
  font-family: "Great Vibes", cursive;
  font-size: clamp(32px, 4vw, 45px);
  text-align: center;
`;

const CountdownSection = styled(Section)`
  background: linear-gradient(180deg, #eae2d8 0%, #f1ebe2 100%);
`;
const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(12px, 3vw, 35px);
  max-width: 780px;
  margin: 46px auto 0;
  @media (max-width: 540px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 12px;
    max-width: 340px;
  }
`;
const CountdownUnit = styled.div`
  position: relative;
  padding: 20px 8px 15px;
  text-align: center;
  border-top: 1px solid rgba(133, 111, 83, 0.4);
  border-bottom: 1px solid rgba(133, 111, 83, 0.4);
  &::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gold);
    top: -2px;
    left: 50%;
  }
`;
const CountdownNumber = styled.div`
  color: var(--ink);
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(42px, 6vw, 68px);
  font-weight: 300;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;
const CountdownLabel = styled.div`
  margin-top: 12px;
  color: #746b60;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;
const CountdownNote = styled.p`
  margin: 35px 0 0;
  color: #736b61;
  font-size: 10px;
  letter-spacing: 0.2em;
  line-height: 2;
  text-align: center;
  text-transform: uppercase;
`;

const GallerySection = styled(Section)`
  background: var(--paper);
`;
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.83fr 1fr;
  align-items: center;
  gap: clamp(12px, 2.5vw, 30px);
  margin-top: 58px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;
const GalleryItem = styled.figure`
  position: relative;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  background: #ded5c9;
  border: 7px solid rgba(255, 253, 248, 0.72);
  box-shadow: 0 16px 38px rgba(51, 43, 32, 0.1);
  transform: translateY(${({ $offset }) => $offset || 0}px);
  &:nth-child(2) {
    transform: translateY(-16px);
  }
  @media (max-width: 720px) {
    transform: none;
    &:nth-child(2) {
      transform: none;
    }
  }
  @media (max-width: 460px) {
    width: min(100%, 360px);
    margin: 0 auto;
  }
`;
const GalleryImage = styled.img`
  display: block;
  width: 100%;
  height: clamp(240px, 33vw, 430px);
  object-fit: cover;
  object-position: center;
  filter: saturate(0.72);
  transition:
    transform 800ms cubic-bezier(0.2, 0.7, 0.2, 1),
    filter 500ms ease;
  ${GalleryItem}:hover & {
    transform: scale(1.045);
    filter: saturate(0.95);
  }
  @media (max-width: 720px) {
    height: clamp(235px, 55vw, 350px);
  }
`;
const GalleryCaption = styled.figcaption`
  padding: 15px 8px 11px;
  color: #62584c;
  font-family: "Cormorant Garamond", serif;
  font-size: 19px;
  font-style: italic;
  text-align: center;
`;
const GalleryQuote = styled.p`
  max-width: 650px;
  margin: 52px auto 0;
  color: #615b52;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(25px, 3.5vw, 39px);
  font-weight: 300;
  line-height: 1.25;
  text-align: center;
  &::before {
    content: "“";
    display: block;
    margin-bottom: 8px;
    color: var(--gold);
    font-size: 54px;
    line-height: 0.65;
  }
`;

const VenueSection = styled(Section)`
  background: #eae2d8;
`;
const VenueCard = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  max-width: 1000px;
  margin: 50px auto 0;
  background: rgba(250, 247, 241, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 18px 54px rgba(58, 48, 34, 0.07);
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const VenuePhoto = styled.div`
  min-height: 370px;
  background-image:
    linear-gradient(0deg, rgba(24, 22, 18, 0.12), rgba(24, 22, 18, 0.02)),
    url(${Patr});
  background-size: cover;
  background-position: center;
  @media (max-width: 700px) {
    min-height: 270px;
  }
`;
const VenueInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 56px) clamp(22px, 4vw, 45px);
  text-align: center;
`;
const VenueIcon = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 22px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--gold);
  svg {
    width: 18px;
    height: 18px;
  }
`;
const VenueLabel = styled.p`
  margin: 0 0 12px;
  color: var(--gold);
  font-size: 9px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
`;
const VenueName = styled.h3`
  margin: 0;
  color: var(--ink);
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(31px, 4vw, 43px);
  font-weight: 400;
  line-height: 1.05;
  text-transform: uppercase;
`;
const VenueText = styled.p`
  margin: 17px 0 0;
  color: #6c655b;
  font-size: 11px;
  letter-spacing: 0.08em;
  line-height: 1.9;
`;
const VenueDate = styled.p`
  margin: 25px 0 0;
  color: var(--ink);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;
const OutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  margin-top: 28px;
  padding: 12px 18px;
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--ink);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color 0.25s ease,
    background 0.25s ease;
  &:hover {
    background: var(--ink);
    color: #fffaf2;
    border-color: var(--ink);
  }
  &:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 3px;
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ProgramSection = styled(Section)`
  background: var(--paper);
`;
const ProgramIntro = styled.p`
  max-width: 590px;
  margin: 25px auto 0;
  color: #756d62;
  font-size: 10px;
  letter-spacing: 0.12em;
  line-height: 2;
  text-align: center;
  text-transform: uppercase;
`;
const ProgramTimeline = styled.div`
  position: relative;
  width: min(100%, 930px);
  margin: 62px auto 0;
  padding: 0;
`;
const TimelineTrack = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(167, 139, 102, 0.5) 4%,
    rgba(167, 139, 102, 0.5) 96%,
    transparent
  );
  @media (max-width: 700px) {
    left: 16px;
  }
`;
const TimelineProgress = styled.div`
  position: absolute;
  top: var(--timeline-start, 0px);
  left: 50%;
  width: 1px;
  height: var(--timeline-length, 0px);
  transform: translateX(-50%) scaleY(var(--timeline-progress, 0));
  transform-origin: top center;
  background: var(--gold);
  pointer-events: none;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--gold);
    transform: translateX(-50%);
  }
  &::before {
    top: 0;
  }
  &::after {
    bottom: -2px;
  }
  @media (max-width: 700px) {
    left: 16px;
  }
`;
const TimelineHeart = styled.div`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 50%;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(167, 139, 102, 0.56);
  border-radius: 50%;
  background: var(--paper);
  color: #a9855b;
  box-shadow: 0 5px 18px rgba(91, 71, 46, 0.12);
  transform: translate3d(
    -50%,
    calc(-50% + var(--timeline-heart-y, 0px)),
    0
  );
  transition:
    background 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
  will-change: transform;
  svg {
    width: 17px;
    height: 17px;
    fill: currentColor;
    stroke-width: 1.4;
    transform-origin: center;
    animation: ${softPulse} 2.8s ease-in-out infinite;
  }
  @media (max-width: 700px) {
    left: 16px;
  }
`;
const TimelineItem = styled.article`
  position: relative;
  display: flex;
  width: 50%;
  padding: 18px 48px 18px 0;
  justify-content: flex-end;
  min-height: 174px;
  box-sizing: border-box;
  ${({ $side }) =>
    $side === "right" &&
    css`
      margin-left: 50%;
      padding: 18px 0 18px 48px;
      justify-content: flex-start;
    `}
  @media (max-width: 700px) {
    width: 100%;
    min-height: auto;
    margin-left: 0;
    padding: 15px 0 15px 52px;
    justify-content: flex-start;
  }
`;
const TimelineMarker = styled.div`
  position: absolute;
  z-index: 2;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "right: -7px;" : "left: -7px;")}
  width: 14px;
  height: 14px;
  border: 1px solid ${({ $active }) => ($active ? "#a9855b" : "#c9b9a2")};
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#a9855b" : "var(--paper)")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 5px rgba(167,139,102,.14)" : "none"};
  transform: translateY(-50%);
  transition:
    background 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  @media (max-width: 700px) {
    left: 9px;
    right: auto;
  }
`;
const TimelineCard = styled.div`
  position: relative;
  width: min(100%, 370px);
  padding: 25px 25px 23px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(167,139,102,.75)" : "rgba(167,139,102,.23)"};
  background: ${({ $active }) =>
    $active ? "#fffdf8" : "rgba(255,253,248,.58)"};
  box-shadow: ${({ $active }) =>
    $active
      ? "0 15px 38px rgba(79,62,40,.10)"
      : "0 7px 22px rgba(79,62,40,.035)"};
  text-align: ${({ $side }) => ($side === "left" ? "right" : "left")};
  transform: ${({ $active }) =>
    $active ? "translateY(-2px)" : "translateY(0)"};
  transition:
    border-color 0.45s ease,
    box-shadow 0.45s ease,
    background 0.45s ease,
    transform 0.45s ease;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    ${({ $side }) => ($side === "left" ? "right: 0;" : "left: 0;")}
    width: 2px;
    height: ${({ $active }) => ($active ? "100%" : "0")};
    background: var(--gold);
    transition: height 0.45s ease;
  }
  @media (max-width: 700px) {
    width: 100%;
    text-align: left;
    padding: 22px 20px;
  }
`;
const TimelineTime = styled.p`
  margin: 0 0 10px;
  color: var(--gold);
  font-family: "Cormorant Garamond", serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1;
`;
const TimelineIcon = styled.div`
  display: inline-grid;
  place-items: center;
  width: 31px;
  height: 31px;
  margin-bottom: 13px;
  border: 1px solid rgba(167, 139, 102, 0.38);
  border-radius: 50%;
  color: var(--gold);
  svg {
    width: 14px;
    height: 14px;
  }
  @media (max-width: 700px) {
    display: grid;
  }
`;
const TimelineTitle = styled.h3`
  margin: 0 0 9px;
  color: var(--ink);
  font-family: "Cormorant Garamond", serif;
  font-size: 25px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;
const TimelineDescription = styled.p`
  margin: 0;
  color: #777065;
  font-size: 10px;
  line-height: 1.9;
  letter-spacing: 0.035em;
`;

const DressSection = styled(Section)`
  background: #eae2d8;
`;
const DressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  max-width: 780px;
  margin: 50px auto 0;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;
const DressCard = styled.div`
  position: relative;
  min-height: 175px;
  padding: 30px 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(250, 247, 241, 0.63);
  text-align: center;
`;
const DressIcon = styled.div`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  margin: 0 auto 17px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--gold);
  svg {
    width: 15px;
    height: 15px;
  }
`;
const DressTitle = styled.h3`
  margin: 0 0 11px;
  font-family: "Cormorant Garamond", serif;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;
const DressText = styled.p`
  max-width: 270px;
  margin: 0 auto;
  color: #746b60;
  font-size: 10px;
  line-height: 1.9;
  letter-spacing: 0.06em;
`;

const ClosingSection = styled(Section)`
  padding-top: 110px;
  padding-bottom: 125px;
  background: #292720;
  color: #fffdf8;
  text-align: center;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${Patrthree});
    background-size: cover;
    background-position: center 48%;
    opacity: 0.13;
    filter: grayscale(1);
  }
`;
const ClosingInner = styled(SectionInner)`
  position: relative;
  z-index: 1;
`;
const ClosingEyebrow = styled.p`
  margin: 0 0 22px;
  color: #d3bd9b;
  font-size: 9px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
`;
const ClosingTitle = styled.h2`
  margin: 0;
  color: #fffdf8;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(40px, 6vw, 70px);
  font-weight: 300;
  line-height: 1.05;
  text-transform: uppercase;
`;
const ClosingText = styled.p`
  max-width: 510px;
  margin: 26px auto 0;
  color: rgba(255, 253, 248, 0.75);
  font-size: 10px;
  letter-spacing: 0.12em;
  line-height: 2.1;
  text-transform: uppercase;
`;
const RSVPButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 50px;
  margin-top: 34px;
  padding: 14px 24px;
  border: 1px solid #d0b894;
  background: #d0b894;
  color: #292720;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
  &:hover {
    background: transparent;
    color: #fffdf8;
    border-color: rgba(255, 253, 248, 0.7);
  }
  &:focus-visible {
    outline: 2px solid #fffdf8;
    outline-offset: 4px;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;
const SignOff = styled.p`
  margin: 45px 0 0;
  color: #d3bd9b;
  font-family: "Great Vibes", cursive;
  font-size: 43px;
`;

const RSVPPage = styled.main`
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 35px 18px;
  background:
    linear-gradient(rgba(39, 38, 33, 0.84), rgba(39, 38, 33, 0.84)),
    url(${Patrfour}) center/cover fixed;
`;
const RSVPForm = styled.form`
  width: min(100%, 510px);
  padding: clamp(28px, 6vw, 52px);
  border: 1px solid rgba(167, 139, 102, 0.38);
  background: #f8f4ed;
  box-shadow: 0 28px 85px rgba(0, 0, 0, 0.22);
`;
const RSVPBack = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 30px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #746b60;
  font-size: 10px;
  letter-spacing: 0.12em;
  cursor: pointer;
  &:hover {
    color: var(--gold);
  }
  svg {
    width: 15px;
    height: 15px;
    transform: rotate(180deg);
  }
`;
const RSVPHeading = styled.h1`
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(36px, 7vw, 52px);
  font-weight: 400;
  text-align: center;
`;
const RSVPSubheading = styled.p`
  margin: 12px 0 32px;
  color: #82786a;
  font-size: 9px;
  letter-spacing: 0.16em;
  line-height: 1.9;
  text-align: center;
  text-transform: uppercase;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 23px;
`;
const FormLabel = styled.label`
  color: #464139;
  font-size: 10px;
  letter-spacing: 0.04em;
`;
const RadioStack = styled.div`
  display: grid;
  gap: 10px;
`;
const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5d564d;
  font-size: 11px;
  cursor: pointer;
  input {
    accent-color: var(--gold);
    width: 15px;
    height: 15px;
  }
`;
const FormInput = styled.input`
  width: 100%;
  min-height: 45px;
  padding: 12px 13px;
  border: 1px solid #ded3c4;
  border-radius: 0;
  outline: none;
  background: #fffdf8;
  color: var(--ink);
  font-size: 12px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  &::placeholder {
    color: #a69c8e;
  }
  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(167, 139, 102, 0.12);
  }
`;
const GuestCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;
const CounterButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d8c8b4;
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #e9dfd2;
  }
`;
const GuestCount = styled.span`
  min-width: 20px;
  color: var(--ink);
  font-family: "Cormorant Garamond", serif;
  font-size: 30px;
  text-align: center;
`;
const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 49px;
  margin-top: 30px;
  border: 1px solid var(--ink);
  background: var(--ink);
  color: #fffdf8;
  font-size: 10px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease;
  &:hover {
    background: transparent;
    color: var(--ink);
  }
  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`;

function getTimeLeft() {
  const distance = Math.max(WEDDING_DATE.getTime() - Date.now(), 0);
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    started: WEDDING_DATE.getTime() <= Date.now(),
  };
}

export default function WeddingInvitation() {
  const [currentSection, setCurrentSection] = useState("main");
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [visibleSections, setVisibleSections] = useState(
    () => new Set(["hero"]),
  );
  const [formData, setFormData] = useState({
    attendance: "",
    guestCount: 1,
    fullName: "",
    age: "",
  });

  const musicRef = useRef(null);
  const sectionRefs = useRef({});
  const timelineRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const timelineHeartRef = useRef(null);
  const timelineMarkersRef = useRef([]);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!isInvitationOpened && currentSection === "main") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow =
        previousOverflow === "hidden" ? "" : previousOverflow;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isInvitationOpened, currentSection]);

  useEffect(() => {
    const updateCountdown = () => setTimeLeft(getTimeLeft());
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((previous) => {
          const next = new Set(previous);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.id);
          });
          return next;
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [currentSection, isInvitationOpened]);

  const updateTimeline = useCallback((timelineTop) => {
    const timeline = timelineRef.current;
    const markerCenters = timelineMarkersRef.current;
    if (!timeline || markerCenters.length === 0) return;

    const firstCenter = markerCenters[0];
    const lastCenter = markerCenters[markerCenters.length - 1];
    const triggerY = window.innerHeight * 0.52;
    const heartPosition = Math.min(
      Math.max(triggerY - timelineTop, firstCenter),
      lastCenter,
    );
    const progress =
      lastCenter > firstCenter
        ? (heartPosition - firstCenter) / (lastCenter - firstCenter)
        : 0;

    timelineProgressRef.current?.style.setProperty(
      "--timeline-progress",
      String(progress),
    );
    timelineHeartRef.current?.style.setProperty(
      "--timeline-heart-y",
      `${heartPosition}px`,
    );

    let activeIndex = 0;
    markerCenters.forEach((center, index) => {
      if (center <= triggerY - timelineTop) activeIndex = index;
    });

    setActiveTimelineIndex((previous) =>
      previous === activeIndex ? previous : activeIndex,
    );
  }, []);

  useEffect(() => {
    let frame = 0;
    let needsMeasure = true;

    const measureTimeline = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const timelineRect = timeline.getBoundingClientRect();
      const markers = Array.from(
        timeline.querySelectorAll("[data-timeline-marker]"),
      );
      if (markers.length === 0) return;
      timelineMarkersRef.current = markers.map((marker) => {
        const rect = marker.getBoundingClientRect();
        return rect.top + rect.height / 2 - timelineRect.top;
      });
      const firstCenter = timelineMarkersRef.current[0];
      const lastCenter =
        timelineMarkersRef.current[timelineMarkersRef.current.length - 1];
      timelineProgressRef.current?.style.setProperty(
        "--timeline-start",
        `${firstCenter}px`,
      );
      timelineProgressRef.current?.style.setProperty(
        "--timeline-length",
        `${Math.max(0, lastCenter - firstCenter)}px`,
      );
      updateTimeline(timelineRect.top);
    };

    const scheduleUpdate = (measure = false) => {
      if (measure) needsMeasure = true;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (needsMeasure) {
          needsMeasure = false;
          measureTimeline();
        } else {
          const timeline = timelineRef.current;
          if (timeline) updateTimeline(timeline.getBoundingClientRect().top);
        }
      });
    };

    const timeline = timelineRef.current;
    const resizeObserver =
      timeline && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => scheduleUpdate(true))
        : null;
    if (timeline) resizeObserver?.observe(timeline);

    scheduleUpdate(true);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    const handleResize = () => scheduleUpdate(true);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [updateTimeline, currentSection, isInvitationOpened]);

  useEffect(
    () => () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    },
    [],
  );

  const getAudio = () => {
    if (!musicRef.current) {
      musicRef.current = new Audio("/wedding-music.mp3");
      musicRef.current.loop = true;
      musicRef.current.volume = 0.35;
    }
    return musicRef.current;
  };

  const toggleMusic = async () => {
    const audio = getAudio();
    if (audio.paused) {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch {
        setIsMusicPlaying(false);
        toast.error(
          "Не удалось включить музыку. Проверьте файл public/wedding-music.mp3.",
        );
      }
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  const openInvitation = () => {
    setIsInvitationOpened(true);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 40);
    // Воспроизведение запускается в ответ на клик пользователя, но не выключаем уже играющую музыку.
    if (!musicRef.current || musicRef.current.paused) toggleMusic();
  };

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const closeRSVP = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      setFormData({ attendance: "", guestCount: 1, fullName: "", age: "" });
    }
    setCurrentSection("main");
    window.setTimeout(
      () => window.scrollTo({ top: 0, behavior: "smooth" }),
      20,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.attendance) {
      toast.error("Пожалуйста, выберите, сможете ли присутствовать.");
      return;
    }
    if (!formData.fullName.trim()) {
      toast.error("Пожалуйста, введите ваше ФИО.");
      return;
    }
    if (!formData.age.trim()) {
      toast.error("Пожалуйста, укажите, кем вы приходитесь молодожёнам.");
      return;
    }
    if (
      formData.attendance === "yes" &&
      (!formData.guestCount || formData.guestCount < 1)
    ) {
      toast.error("Пожалуйста, укажите количество гостей.");
      return;
    }

    const willAttend = formData.attendance === "yes";
    const payload = {
      willAttend,
      guestCount: willAttend ? formData.guestCount : 0,
      fullName: formData.fullName.trim(),
      relatives: formData.age.trim(),
    };

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/users", payload);

      toast.success(
        willAttend
          ? "Спасибо за ответ! Ждём вас на нашей свадьбе! 💕"
          : "Спасибо, что сообщили. Будем рады увидеться в другой раз!",
      );
      setIsSubmitted(true);
    } catch {
      toast.error(
        "Не удалось отправить ответ. Проверьте соединение и настройки API.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLocation = () =>
    window.open(WEDDING_MAP_URL, "_blank", "noopener,noreferrer");
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Bishkek",
  }).format(WEDDING_DATE);

  if (currentSection === "rsvp" && isSubmitted) {
    return (
      <>
        <GlobalStyle />
        <RSVPPage>
          <RSVPForm as="section" aria-live="polite">
            <RSVPBack type="button" onClick={closeRSVP}>
              <ArrowDown /> К приглашению
            </RSVPBack>
            <RSVPHeading>Спасибо за ответ!</RSVPHeading>
            <RSVPSubheading>
              {formData.attendance === "yes"
                ? "Ваш ответ получен. Будем рады разделить этот день вместе."
                : "Ваш ответ получен. Спасибо, что сообщили нам."}
            </RSVPSubheading>
          </RSVPForm>
        </RSVPPage>
      </>
    );
  }

  if (currentSection === "rsvp") {
    return (
      <>
        <GlobalStyle />
        <RSVPPage>
          <RSVPForm onSubmit={handleSubmit}>
            <RSVPBack type="button" onClick={closeRSVP}>
              <ArrowDown /> Назад к приглашению
            </RSVPBack>
            <RSVPHeading>Будете с нами?</RSVPHeading>
            <RSVPSubheading>
              Пожалуйста, подтвердите присутствие
              <br />
              на нашей свадьбе
            </RSVPSubheading>

            <FormGroup>
              <FormLabel>Сможете ли вы присутствовать?</FormLabel>
              <RadioStack>
                <RadioOption>
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === "yes"}
                    onChange={(event) =>
                      handleInputChange("attendance", event.target.value)
                    }
                  />
                  Обязательно буду
                </RadioOption>
                <RadioOption>
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === "no"}
                    onChange={(event) =>
                      handleInputChange("attendance", event.target.value)
                    }
                  />
                  К сожалению, не смогу
                </RadioOption>
              </RadioStack>
            </FormGroup>

            {formData.attendance === "yes" && (
              <FormGroup>
                <FormLabel>Сколько человек придёт?</FormLabel>
                <GuestCounter>
                  <CounterButton
                    type="button"
                    aria-label="Уменьшить количество гостей"
                    onClick={() =>
                      handleInputChange(
                        "guestCount",
                        Math.max(1, formData.guestCount - 1),
                      )
                    }
                  >
                    −
                  </CounterButton>
                  <GuestCount>{formData.guestCount}</GuestCount>
                  <CounterButton
                    type="button"
                    aria-label="Увеличить количество гостей"
                    onClick={() =>
                      handleInputChange("guestCount", formData.guestCount + 1)
                    }
                  >
                    +
                  </CounterButton>
                </GuestCounter>
              </FormGroup>
            )}

            {formData.attendance && (
              <>
                <FormGroup>
                  <FormLabel htmlFor="fullName">Ваше имя и фамилия</FormLabel>
                  <FormInput
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(event) =>
                      handleInputChange("fullName", event.target.value)
                    }
                    placeholder="Введите ваше ФИО"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="relatives">
                    Кем вы приходитесь молодожёнам?
                  </FormLabel>
                  <FormInput
                    id="relatives"
                    type="text"
                    value={formData.age}
                    onChange={(event) =>
                      handleInputChange("age", event.target.value)
                    }
                    placeholder="Родственник, друг..."
                    required
                  />
                </FormGroup>
              </>
            )}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Отправляем..."
              ) : (
                <>
                  Отправить ответ <Check />
                </>
              )}
            </SubmitButton>
          </RSVPForm>
        </RSVPPage>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <OpeningScreen
        $opened={isInvitationOpened}
        role="button"
        tabIndex={isInvitationOpened ? -1 : 0}
        aria-label="Открыть свадебное приглашение"
        onClick={openInvitation}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
          }
        }}
      >
        <OpeningInner>
          <OpeningEyebrow>Свадебное приглашение</OpeningEyebrow>
          <OpeningNames>Бакай</OpeningNames>
          <OpeningAmpersand>&</OpeningAmpersand>
          <OpeningNames>Мээрим</OpeningNames>
          <OpeningDate>21 · 11 · 2026</OpeningDate>
          <OpenInvitationButton type="button" tabIndex={-1}>
            Нажмите, чтобы открыть <ArrowDown />
          </OpenInvitationButton>
        </OpeningInner>
      </OpeningScreen>

      <MusicToggle
        type="button"
        onClick={toggleMusic}
        aria-label={
          isMusicPlaying ? "Поставить музыку на паузу" : "Включить музыку"
        }
        title={isMusicPlaying ? "Пауза" : "Включить музыку"}
      >
        {isMusicPlaying ? <Pause size={17} /> : <Play size={17} />}
      </MusicToggle>

      <PageShell>
        <HeroSection
          id="hero"
          ref={(element) => {
            sectionRefs.current.hero = element;
          }}
        >
          <HeroContent $visible={visibleSections.has("hero")}>
            <HeroEyebrow>Приглашение на свадьбу</HeroEyebrow>
            <HeroTitle>
              <HeroName>Бакай</HeroName>
              <HeroAnd>&</HeroAnd>
              <HeroName>Мээрим</HeroName>
            </HeroTitle>
            <HeroRule />
            <HeroDate>
              {formattedDate} <span aria-hidden="true">·</span> 15:00
            </HeroDate>
            <HeroScroll
              type="button"
              onClick={() => scrollToSection("invitation")}
            >
              Листайте вниз <ArrowDown />
            </HeroScroll>
          </HeroContent>
        </HeroSection>

        <IntroSection
          id="invitation"
          ref={(element) => {
            sectionRefs.current.invitation = element;
          }}
        >
          <SectionInner $visible={visibleSections.has("invitation")}>
            <SectionEyebrow>Дорогие родные и друзья</SectionEyebrow>
            <SectionTitle>
              Разделите с нами
              <br />
              этот особенный день
            </SectionTitle>
            <FineRule>
              <Heart />
            </FineRule>
            <IntroCopy>
              Мы приглашаем вас разделить с нами радостный день, в который мы
              станем семьёй. В этот волшебный день мы скажем друг другу «Да» и
              соединим сердца и судьбы в кругу самых близких и родных.
            </IntroCopy>
            <IntroSignature>С любовью, Бакай и Мээрим</IntroSignature>
          </SectionInner>
        </IntroSection>

        <CountdownSection
          id="countdown"
          ref={(element) => {
            sectionRefs.current.countdown = element;
          }}
        >
          <SectionInner $visible={visibleSections.has("countdown")}>
            <SectionEyebrow>Сохраните дату</SectionEyebrow>
            <SectionTitle>
              {timeLeft.started ? "Сегодня наш день" : "До торжества осталось"}
            </SectionTitle>
            {!timeLeft.started && (
              <CountdownGrid aria-label="Обратный отсчёт до свадьбы">
                {[
                  { label: "Дней", value: timeLeft.days },
                  { label: "Часов", value: timeLeft.hours },
                  { label: "Минут", value: timeLeft.minutes },
                  { label: "Секунд", value: timeLeft.seconds },
                ].map((unit) => (
                  <CountdownUnit key={unit.label}>
                    <CountdownNumber>
                      {String(unit.value).padStart(2, "0")}
                    </CountdownNumber>
                    <CountdownLabel>{unit.label}</CountdownLabel>
                  </CountdownUnit>
                ))}
              </CountdownGrid>
            )}
            <CountdownNote>
              <CalendarDays
                size={14}
                style={{ verticalAlign: "-3px", marginRight: 8 }}
              />
              21 ноября 2026 года · начало в 15:00
            </CountdownNote>
          </SectionInner>
        </CountdownSection>

        <GallerySection
          id="photos"
          ref={(element) => {
            sectionRefs.current.photos = element;
          }}
        >
          <SectionInner
            $visible={visibleSections.has("photos")}
            $maxWidth="1120px"
          >
            <SectionEyebrow>Наша история</SectionEyebrow>
            <SectionTitle>
              Мгновения, которые
              <br />
              хочется помнить
            </SectionTitle>
            <FineRule>
              <Heart />
            </FineRule>
            <GalleryGrid>
              <GalleryItem $offset={18}>
                <GalleryImage
                  src={Patr}
                  alt="Фотография Бакая и Мээрим"
                  loading="lazy"
                />
                <GalleryCaption>Всё начинается с нас</GalleryCaption>
              </GalleryItem>
              <GalleryItem>
                <GalleryImage
                  src={Patrthree}
                  alt="Бакай и Мээрим вместе"
                  loading="lazy"
                />
                <GalleryCaption>Шаг за шагом — вместе</GalleryCaption>
              </GalleryItem>
              <GalleryItem $offset={28}>
                <GalleryImage
                  src={Patrfour}
                  alt="История любви Бакая и Мээрим"
                  loading="lazy"
                />
                <GalleryCaption>Впереди — целая жизнь</GalleryCaption>
              </GalleryItem>
            </GalleryGrid>
            <GalleryQuote>
              Самые тёплые воспоминания рождаются тогда, когда рядом самые
              близкие.
            </GalleryQuote>
          </SectionInner>
        </GallerySection>

        <VenueSection
          id="venue"
          ref={(element) => {
            sectionRefs.current.venue = element;
          }}
        >
          <SectionInner
            $visible={visibleSections.has("venue")}
            $maxWidth="1100px"
          >
            <SectionEyebrow>Будем ждать вас</SectionEyebrow>
            <SectionTitle>Место встречи</SectionTitle>
            <VenueCard>
              <VenuePhoto
                role="img"
                aria-label="Фотография для оформления блока места проведения"
              />
              <VenueInfo>
                <VenueIcon>
                  <MapPin />
                </VenueIcon>
                <VenueLabel>Место проведения</VenueLabel>
                <VenueName>Хан Тенгри</VenueName>
                <VenueText>г. Каракол, Кыргызстан</VenueText>
                <VenueDate>21 ноября 2026 · 15:00</VenueDate>
                <OutlineButton type="button" onClick={openLocation}>
                  <MapPin /> Построить маршрут
                </OutlineButton>
              </VenueInfo>
            </VenueCard>
          </SectionInner>
        </VenueSection>

        <ProgramSection
          id="program"
          ref={(element) => {
            sectionRefs.current.program = element;
          }}
        >
          <SectionInner
            $visible={visibleSections.has("program")}
            $maxWidth="1050px"
          >
            <SectionEyebrow>План нашего дня</SectionEyebrow>
            <SectionTitle>Программа торжества</SectionTitle>
            <FineRule>
              <Heart />
            </FineRule>
            <ProgramIntro>
              Каждый момент этого дня особенный. Присоединяйтесь к нам и
              проведите его вместе.
            </ProgramIntro>
            <ProgramTimeline ref={timelineRef}>
              <TimelineTrack aria-hidden="true" />
              <TimelineProgress
                ref={timelineProgressRef}
                aria-hidden="true"
              />
              <TimelineHeart ref={timelineHeartRef} aria-hidden="true">
                <Heart />
              </TimelineHeart>
              {events.map(({ time, title, description, Icon }, index) => {
                const side = index % 2 === 0 ? "left" : "right";
                const active = index === activeTimelineIndex;
                return (
                  <TimelineItem
                    key={`${time}-${title}`}
                    $side={side}
                    data-timeline-item
                    aria-current={active ? "step" : undefined}
                  >
                    <TimelineMarker
                      $side={side}
                      $active={active}
                      data-timeline-marker
                      aria-hidden="true"
                    />
                    <TimelineCard $side={side} $active={active}>
                      <TimelineIcon>
                        <Icon />
                      </TimelineIcon>
                      <TimelineTime>{time}</TimelineTime>
                      <TimelineTitle>{title}</TimelineTitle>
                      <TimelineDescription>{description}</TimelineDescription>
                    </TimelineCard>
                  </TimelineItem>
                );
              })}
            </ProgramTimeline>
          </SectionInner>
        </ProgramSection>

        <DressSection
          id="dresscode"
          ref={(element) => {
            sectionRefs.current.dresscode = element;
          }}
        >
          <SectionInner $visible={visibleSections.has("dresscode")}>
            <SectionEyebrow>Детали вечера</SectionEyebrow>
            <SectionTitle>Будем рады видеть вас</SectionTitle>
            <FineRule>
              <Sparkles />
            </FineRule>
            <DressGrid>
              <DressCard>
                <DressIcon>
                  <Users />
                </DressIcon>
                <DressTitle>Для женщин</DressTitle>
                <DressText>
                  Выбирайте элегантные образы в которых вам будет комфортно
                  праздновать вместе с нами.
                </DressText>
              </DressCard>
              <DressCard>
                <DressIcon>
                  <Gem />
                </DressIcon>
                <DressTitle>Для мужчин</DressTitle>
                <DressText>
                  Классический праздничный образ станет прекрасным выбором для
                  нашего вечера.
                </DressText>
              </DressCard>
            </DressGrid>
          </SectionInner>
        </DressSection>

        <ClosingSection
          id="rsvp-cta"
          ref={(element) => {
            sectionRefs.current["rsvp-cta"] = element;
          }}
        >
          <ClosingInner $visible={visibleSections.has("rsvp-cta")}>
            <ClosingEyebrow>21 · 11 · 2026</ClosingEyebrow>
            <ClosingTitle>
              До встречи
              <br />
              на нашей свадьбе
            </ClosingTitle>
            <FineRule>
              <Heart />
            </FineRule>
            <ClosingText>
              Ваше присутствие сделает этот день ещё счастливее. Пожалуйста,
              сообщите нам, сможете ли вы прийти.
            </ClosingText>
            <RSVPButton type="button" onClick={() => setCurrentSection("rsvp")}>
              <Users /> Подтвердить присутствие
            </RSVPButton>
            <SignOff>С теплом, Бакай и Мээрим</SignOff>
          </ClosingInner>
        </ClosingSection>
      </PageShell>
    </>
  );
}
