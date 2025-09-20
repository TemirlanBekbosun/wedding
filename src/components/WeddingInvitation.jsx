import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import styled, { keyframes, css } from "styled-components";
import Patr from "../assets/patr2.jpg";
import Patrthree from "../assets/patr3.jpg";
import Patrfour from "../assets/patr4.jpg";
// Анимации
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const floatDelay1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
`;

const floatDelay2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(8deg); }
`;

const floatHeart0 = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
  50% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
`;

const floatHeart1 = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
  50% { transform: translateY(-20px) scale(0.8); opacity: 0.5; }
`;

const floatHeart2 = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
  50% { transform: translateY(-35px) scale(1.1); opacity: 0.7; }
`;

const floatHeart3 = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.25; }
  50% { transform: translateY(-25px) scale(0.9); opacity: 0.55; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounceGentle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Новые анимации для декоративных элементов
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const sway = keyframes`
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(10px) rotate(2deg); }
  75% { transform: translateX(-10px) rotate(-2deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
`;

const floatUpDown = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

// Styled Components
const MainContainer = styled.div`
  background: linear-gradient(135deg, #1d2d44 0%, #344966 50%, #c7d9e5 100%);
`;

const RSVPContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1d2d44 0%, #344966 50%, #c7d9e5 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem 1rem 1rem;
`;

const RSVPForm = styled.div`
  max-width: 28rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${fadeInUp} 0.8s ease-out forwards;
  overflow: visible;

  @media (max-width: 600px) {
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: none;
  }
`;

const RSVPHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RSVPHeart = styled(Heart)`
  width: 3rem;
  height: 3rem;
  color: white;
  margin: 0 auto 1rem;
  animation: pulse 2s infinite;
`;

const RSVPTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${(props) => props.mb || "0.5rem"};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 1rem;
  height: 1rem;
  color: #dc2626;
  background-color: #dc2626;
`;

const RadioText = styled.span`
  color: white;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const CounterButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CounterDisplay = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  overflow: visible;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 600px) {
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  ${(props) =>
    props.primary
      ? css`
          background: white;
          color: #1d2d44;
          font-weight: bold;

          &:hover {
            background: rgba(255, 255, 255, 0.9);
          }
        `
      : css`
          background: rgba(255, 255, 255, 0.2);
          color: white;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: ${(props) => props.padding || "0"};
`;

const HeroSection = styled(Section)`
  position: relative;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  inset: 0;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 5rem;
    left: 2.5rem;
    width: 8rem;
    height: 8rem;
  }

  &:nth-child(2) {
    top: 10rem;
    right: 5rem;
    width: 6rem;
    height: 6rem;
    background: rgba(255, 255, 255, 0.1);
    animation: ${floatDelay1} 8s ease-in-out infinite;
  }

  &:nth-child(3) {
    bottom: 8rem;
    left: 8rem;
    width: 5rem;
    height: 5rem;
    animation: ${floatDelay2} 7s ease-in-out infinite;
  }

  &:nth-child(4) {
    bottom: 5rem;
    right: 4rem;
    width: 9rem;
    height: 9rem;
  }
`;

const FloatingHeart = styled(Heart)`
  position: absolute;
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.2);
  animation: ${(props) => {
      const animations = [floatHeart0, floatHeart1, floatHeart2, floatHeart3];
      return animations[props.index % 4];
    }}
    ${(props) => 4 + (props.index % 2) * 0.5}s ease-in-out infinite;
  animation-delay: ${(props) => props.index * 0.5}s;
  top: ${(props) => 20 + props.index * 10}%;
  left: ${(props) => 10 + props.index * 8}%;
`;

// Декоративные элементы для секции обратного отсчета
const StarElement = styled.div`
  position: absolute;
  width: 0.75rem;
  height: 0.75rem;
  background: rgba(255, 255, 255, 0.4);
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  animation: ${twinkle} ${(props) => 2 + props.index * 0.3}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.index * 0.4}s;
  top: ${(props) => 10 + props.index * 12}%;
  left: ${(props) => 5 + props.index * 15}%;
`;

const DiamondElement = styled.div`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  animation: ${rotateSlow} ${(props) => 8 + props.index}s linear infinite;
  top: ${(props) => 15 + props.index * 18}%;
  right: ${(props) => 8 + props.index * 12}%;
`;

const CircleElement = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  animation: ${pulseGlow} ${(props) => 3 + props.index * 0.5}s ease-in-out
    infinite;
  width: ${(props) => 3 + props.index * 0.5}rem;
  height: ${(props) => 3 + props.index * 0.5}rem;
  top: ${(props) => 25 + props.index * 20}%;
  left: ${(props) => 20 + props.index * 10}%;
`;

// Декоративные элементы для секции фото
const FlowerElement = styled.div`
  position: absolute;
  width: 2rem;
  height: 2rem;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 70%
  );
  border-radius: 50%;
  animation: ${floatUpDown} ${(props) => 4 + props.index * 0.5}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.index * 0.6}s;
  top: ${(props) => 20 + props.index * 15}%;
  right: ${(props) => 10 + props.index * 18}%;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.5rem;
    height: 0.5rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
  }
`;

const LeafElement = styled.div`
  position: absolute;
  width: 1.5rem;
  height: 3rem;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: 0 100% 0 100%;
  animation: ${sway} ${(props) => 5 + props.index * 0.3}s ease-in-out infinite;
  animation-delay: ${(props) => props.index * 0.8}s;
  top: ${(props) => 30 + props.index * 12}%;
  left: ${(props) => 15 + props.index * 20}%;
  transform-origin: bottom center;
`;

// Декоративные элементы для секции деталей
const RomanticHeart = styled(Heart)`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  animation: ${(props) => (props.index % 2 === 0 ? floatHeart0 : floatHeart1)}
    ${(props) => 6 + props.index * 0.5}s ease-in-out infinite;
  animation-delay: ${(props) => props.index * 0.7}s;
  top: ${(props) => 15 + props.index * 16}%;
  right: ${(props) => 12 + props.index * 14}%;
`;

const SparkleElement = styled(Sparkles)`
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  color: rgba(255, 255, 255, 0.4);
  animation: ${twinkle} ${(props) => 2.5 + props.index * 0.4}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.index * 0.5}s;
  top: ${(props) => 25 + props.index * 18}%;
  left: ${(props) => 8 + props.index * 16}%;
`;

const HeroContent = styled.div`
  text-align: center;
  z-index: 10;
  transition: all 1s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "10px")});
`;

const SparklesIcon = styled(Sparkles)`
  width: 4rem;
  height: 4rem;
  color: white;
  margin: 0 auto 1.5rem;
  animation: ${spinSlow} 8s linear infinite;
`;

const MainTitle = styled.h1`
  font-size: 3.75rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  font-family: serif;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const TitleSpan = styled.span`
  display: inline-block;
  animation: ${fadeInUp} 1s ease-out forwards;

  &:nth-child(2) {
    font-size: 2.25rem;
    margin: 0 1rem;
    animation: pulse 2s infinite;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &:nth-child(3) {
    animation: ${fadeInUp} 1s ease-out 0.5s forwards;
    opacity: 0;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out 1s forwards;
  opacity: 0;
`;

const ScrollButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  padding: 1rem 2rem;
  border-radius: 9999px;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  animation: ${bounceGentle} 2s ease-in-out infinite;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CountdownSection = styled(Section)`
  padding: 2rem;
`;

const CountdownContent = styled.div`
  text-align: center;
  max-width: 64rem;
  transition: all 1s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "10px")});
`;

const CountdownTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out forwards;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CountdownCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 1s ease-out forwards;
  transition: all 0.5s;
  animation-delay: ${(props) => props.delay}s;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CountdownNumber = styled.div`
  font-size: 2.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  font-family: monospace;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const CountdownLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const DateCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CalendarIcon = styled(Calendar)`
  width: 3rem;
  height: 3rem;
  color: white;
  margin: 0 auto 1rem;
`;

const DateTitle = styled.h3`
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const DateSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
`;

const PhotoSection = styled(Section)`
  padding: 2rem;
`;

const PhotoContent = styled.div`
  max-width: 72rem;
  width: 100%;
  transition: all 1s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "10px")});
`;

const PhotoTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 1s ease-out forwards;
`;

const PhotoGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PhotoCard = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    transform: scale(1.05)
      ${(props) => (props.rotate ? "rotate(1deg)" : "rotate(-1deg)")};
  }
`;

const PhotoImage = styled.div`
  height: 24rem;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.5s;
  background-size: cover;
  background-position: center;
  background-image: ${(props) => props.bgImage};
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  border-radius: 1.5rem;
  pointer-events: none;
  overflow: hidden;
`;

const PhotoCaption = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: white;
  border-radius: 1.5rem;
  overflow: hidden;
`;

const PhotoText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
`;

const QuoteSection = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const Quote = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  font-weight: 300;
  line-height: 1.6;
`;

const DetailsSection = styled(Section)`
  padding: 2rem;
`;

const DetailsContent = styled.div`
  max-width: 64rem;
  width: 100%;
  transition: all 1s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? "0" : "10px")});
`;

const DetailsTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 1s ease-out forwards;
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const DetailIcon = styled.div`
  width: 3rem;
  height: 3rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
`;

const DetailText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-bottom: ${(props) => props.mb || "0.5rem"};
`;

const DetailSubtext = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const RSVPButtonContainer = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const RSVPButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: #1d2d44;
  padding: 1.25rem 2.5rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  transform: scale(1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: pulse 2s infinite;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.05);
  }
`;

const UsersIcon = styled(Users)`
  width: 1.75rem;
  height: 1.75rem;
`;

const BouquetImage = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  width: 16rem;
  height: 20rem;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: rotate(12deg);
  transition: transform 0.5s;
  background-size: cover;
  background-position: center;
  background-image: url(${Patr});

  &:hover {
    transform: rotate(6deg);
  }
`;

const BASE_URL = "https://7ac5a3df9a7e5d25.mokky.dev";

export default function WeddingInvitation() {
  const [currentSection, setCurrentSection] = useState("main");
  const [formData, setFormData] = useState({
    attendance: "",
    guestCount: 1,
    fullName: "",
    age: "",
    phone: "",
  });
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  // Обратный отсчет до свадьбы
  useEffect(() => {
    const targetDate = new Date("2025-09-29T18:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Анимации при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const willAttend = formData.attendance === "yes";
    const payload = {
      willAttend,
      guestCount: willAttend ? formData.guestCount : 0,
      fullName: formData.fullName,
      relatives: formData.age,
    };

    try {
      await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(
        willAttend
          ? "Спасибо за ответ! Ждем вас на нашей свадьбе! 💕"
          : "Спасибо за ответ! Будем рады видеть вас в другой раз!"
      );
    } catch (e) {
      alert("Ошибка отправки. Попробуйте позже.");
    }
    setCurrentSection("main");
  };

  const openLocation = () => {
    window.open("https://2gis.kg/bishkek/geo/70000001081568666", "_blank");
  };

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth" });
  };

  if (currentSection === "rsvp") {
    return (
      <RSVPContainer>
        <RSVPForm>
          <RSVPHeader>
            <RSVPHeart />
            <RSVPTitle>Подтвердите присутствие</RSVPTitle>
          </RSVPHeader>

          <FormSection>
            <FormGroup>
              <Label mb="0.75rem">Сможете ли присутствовать?</Label>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === "yes"}
                    onChange={(e) =>
                      handleInputChange("attendance", e.target.value)
                    }
                  />
                  <RadioText>Обязательно буду</RadioText>
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === "no"}
                    onChange={(e) =>
                      handleInputChange("attendance", e.target.value)
                    }
                  />
                  <RadioText>К сожалению, не смогу</RadioText>
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            {formData.attendance === "yes" && (
              <FormGroup>
                <Label mb="0.5rem">Сколько человек придет на свадьбу?</Label>
                <CounterContainer>
                  <CounterButton
                    onClick={() =>
                      handleInputChange(
                        "guestCount",
                        Math.max(1, formData.guestCount - 1)
                      )
                    }
                  >
                    −
                  </CounterButton>
                  <CounterDisplay>{formData.guestCount}</CounterDisplay>
                  <CounterButton
                    onClick={() =>
                      handleInputChange("guestCount", formData.guestCount + 1)
                    }
                  >
                    +
                  </CounterButton>
                </CounterContainer>
              </FormGroup>
            )}

            {formData.attendance && (
              <>
                <FormGroup>
                  <Label mb="0.5rem">Имена гостей на свадьбе?</Label>
                  <TextInput
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Введите ваше ФИО"
                  />
                </FormGroup>

                <FormGroup>
                  <Label mb="0.5rem">Кем вы будете для молодежи?</Label>
                  <TextInput
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Родственник/друг"
                  />
                </FormGroup>
              </>
            )}
          </FormSection>

          <ButtonGroup>
            <Button onClick={() => setCurrentSection("main")}>Назад</Button>
            <Button primary onClick={handleSubmit}>
              Отправить
            </Button>
          </ButtonGroup>
        </RSVPForm>
      </RSVPContainer>
    );
  }

  return (
    <MainContainer>
      {/* Секция 1: Главная с именами */}
      <HeroSection id="hero" ref={(el) => (sectionRefs.current.hero = el)}>
        {/* Анимированный фон */}
        <AnimatedBackground>
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />

          {/* Плавающие сердца */}
          {[...Array(8)].map((_, i) => (
            <FloatingHeart key={i} index={i} />
          ))}
        </AnimatedBackground>

        <HeroContent visible={visibleSections.has("hero")}>
          <SparklesIcon />
          <MainTitle>
            <TitleSpan>Дастан</TitleSpan>
            <TitleSpan>&</TitleSpan>
            <TitleSpan>Атыргүл</TitleSpan>
          </MainTitle>
          <Subtitle>Приглашают на свою свадьбу</Subtitle>

          <ScrollButton onClick={() => scrollToSection("countdown")}>
            <span>Узнать больше</span>
            <ArrowDown className="w-5 h-5" />
          </ScrollButton>
        </HeroContent>
      </HeroSection>

      {/* Секция 2: Обратный отсчет */}
      <CountdownSection
        id="countdown"
        ref={(el) => (sectionRefs.current.countdown = el)}
      >
        {/* Анимированный фон с звездами и геометрическими фигурами */}
        <AnimatedBackground>
          {/* Звезды */}
          {[...Array(6)].map((_, i) => (
            <StarElement key={`star-${i}`} index={i} />
          ))}

          {/* Бриллианты */}
          {[...Array(4)].map((_, i) => (
            <DiamondElement key={`diamond-${i}`} index={i} />
          ))}

          {/* Круги с пульсацией */}
          {[...Array(3)].map((_, i) => (
            <CircleElement key={`circle-${i}`} index={i} />
          ))}
        </AnimatedBackground>

        {/* Фото букета каллы */}
        <BouquetImage />

        <CountdownContent visible={visibleSections.has("countdown")}>
          <CountdownTitle>До самого важного дня</CountdownTitle>

          <CountdownGrid>
            {[
              { label: "Дней", value: countdown.days },
              { label: "Часов", value: countdown.hours },
              { label: "Минут", value: countdown.minutes },
              { label: "Секунд", value: countdown.seconds },
            ].map((item, index) => (
              <CountdownCard key={item.label} delay={index * 0.2}>
                <CountdownNumber>
                  {String(item.value).padStart(2, "0")}
                </CountdownNumber>
                <CountdownLabel>{item.label}</CountdownLabel>
              </CountdownCard>
            ))}
          </CountdownGrid>

          <DateCard>
            <CalendarIcon />
            <DateTitle>29 сентября 2025</DateTitle>
            <DateSubtitle>Воскресенье, 18:00</DateSubtitle>
          </DateCard>
        </CountdownContent>
      </CountdownSection>

      {/* Секция 3: Романтические фото */}
      <PhotoSection id="photos" ref={(el) => (sectionRefs.current.photos = el)}>
        {/* Анимированный фон с цветами и листьями */}
        <AnimatedBackground>
          {/* Цветы */}
          {[...Array(5)].map((_, i) => (
            <FlowerElement key={`flower-${i}`} index={i} />
          ))}

          {/* Листья */}
          {[...Array(6)].map((_, i) => (
            <LeafElement key={`leaf-${i}`} index={i} />
          ))}
        </AnimatedBackground>

        <PhotoContent visible={visibleSections.has("photos")}>
          <PhotoTitle>Наша история любви</PhotoTitle>

          <PhotoGrid>
            {/* Фото с букетом */}
            <PhotoCard>
              <PhotoImage bgImage={`url(${Patrfour})`} />
              <PhotoOverlay />
              <PhotoCaption>
                <PhotoText>Элегантность в каждой детали</PhotoText>
              </PhotoCaption>
            </PhotoCard>

            {/* Фото невесты */}
            <PhotoCard rotate>
              <PhotoImage bgImage={`url(${Patrthree})`} />
              <PhotoOverlay />
              <PhotoCaption>
                <PhotoText>Шаг к счастью вместе</PhotoText>
              </PhotoCaption>
            </PhotoCard>
          </PhotoGrid>

          <QuoteSection>
            <Quote>
              "И вот мы идем навстречу нашему общему будущему, <br />
              держась за руки и веря в силу нашей любви"
            </Quote>
          </QuoteSection>
        </PhotoContent>
      </PhotoSection>

      {/* Секция 4: Локация и детали */}
      <DetailsSection
        id="details"
        ref={(el) => (sectionRefs.current.details = el)}
      >
        {/* Анимированный фон с романтическими элементами */}
        <AnimatedBackground>
          {/* Романтические сердца */}
          {[...Array(8)].map((_, i) => (
            <RomanticHeart key={`romantic-heart-${i}`} index={i} />
          ))}

          {/* Блестки */}
          {[...Array(7)].map((_, i) => (
            <SparkleElement key={`sparkle-${i}`} index={i} />
          ))}
        </AnimatedBackground>

        <DetailsContent visible={visibleSections.has("details")}>
          <DetailsTitle>Детали торжества</DetailsTitle>

          {/* Основная информация */}
          <DetailsGrid style={{ marginBottom: "3rem" }}>
            <DetailCard>
              <DetailIcon as={MapPin} />
              <DetailTitle>Место проведения</DetailTitle>
              <DetailText mb="1.5rem">Асман кафе, Каракол</DetailText>
              <Button
                primary
                onClick={openLocation}
                style={{ width: "100%", padding: "0.75rem 1.5rem" }}
              >
                Построить маршрут
              </Button>
            </DetailCard>
          </DetailsGrid>

          {/* Программа дня */}
          <div style={{ marginBottom: "3rem" }}>
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              Программа торжества
            </h3>

            <DetailsGrid>
              <DetailCard>
                <DetailIcon as={Clock} />
                <DetailTitle>12:00 - 14:00</DetailTitle>
                <DetailText mb="0.5rem"> Свадебная церемония</DetailText>
                <DetailSubtext>
                  Торжественная церемония бракосочетания и поздравления
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailIcon as={Heart} />
                <DetailTitle>15:00 - 16:00</DetailTitle>
                <DetailText mb="0.5rem">Свадебное катание</DetailText>
                <DetailSubtext>
                  Начинаем день с радостных моментов и красивых фотографий
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailIcon as={Sparkles} />
                <DetailTitle>16:00 - 22:00</DetailTitle>
                <DetailText mb="0.5rem">Ресторан</DetailText>
                <DetailSubtext>
                  Музыкальная шоу-программа, танцы и праздничный банкет
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailIcon as={Users} />
                <DetailTitle>После 22:00</DetailTitle>
                <DetailText mb="0.5rem">Продолжение банкета</DetailText>
                <DetailSubtext>
                  По желанию гостей - неформальное общение и веселье
                </DetailSubtext>
              </DetailCard>
            </DetailsGrid>
          </div>

          <RSVPButtonContainer>
            <RSVPButton onClick={() => setCurrentSection("rsvp")}>
              <UsersIcon />
              <span>Подтвердить присутствие</span>
            </RSVPButton>
          </RSVPButtonContainer>
        </DetailsContent>
      </DetailsSection>
    </MainContainer>
  );
}
