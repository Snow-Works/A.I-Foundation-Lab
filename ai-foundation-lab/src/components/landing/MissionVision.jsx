// src/components/landing/MissionVision.jsx
import { Target, Eye, GraduationCap } from "lucide-react";
import LandingSection from "./LandingSection.jsx";
import Card from "../ui/Card.jsx";
import PillTab from "../ui/PillTab.jsx";
import { Stagger, StaggerItem } from "../ui/motion.js";
import "./MissionVision.css";

const CARDS = [
    {
        id: "mission",
        label: "Mission",
        accent: "pink",
        Icon: Target,
        body: (
            <>
                To give students who are already proficient in programming a guild
                through which to build and apply artificial intelligence to their
                academic fields of study, and to use it as a practical tool for
                solving real problems within those fields.
            </>
        ),
    },
    {
        id: "vision",
        label: "Vision",
        accent: "cyan",
        Icon: Eye,
        body: (
            <>
                To build a community of students who can build and apply artificial
                intelligence to their respective academic fields.
            </>
        ),
    },
    {
        id: "who-for",
        label: "Who is the Lab for?",
        accent: "orange",
        Icon: GraduationCap,
        body: (
            <>
                The AI Foundation Lab is{" "}
                <strong className="mv__emphasis">not</strong> an entry point for
                beginners. It is a guild for students who already have working
                programming ability and are looking for a structured opportunity to
                direct that skill towards building and applying AI within their own
                academic discipline — or towards solving problems native to their
                field of study.
            </>
        ),
    },
];

export default function MissionVision() {
    return (
        <LandingSection
            id="foundation"
            containerWidth="lg"
            paddingTop="xl"
            paddingBottom="lg"
        >
            <Stagger staggerDelay={0.15} className="mv__stack">
                {CARDS.map(({ id, label, accent, Icon, body }) => (
                    <StaggerItem key={id} id={id} className="mv__slot">
                        <Card
                            variant="glass"
                            size="lg"
                            withTab
                            glow={accent}
                            accent={accent}
                            className="mv__card"
                        >
                            <PillTab
                                floating
                                position="center"
                                variant="default"
                                icon={<Icon size={12} />}
                            >
                                {label}
                            </PillTab>

                            <p className="type-body-lg mv__body">{body}</p>
                        </Card>
                    </StaggerItem>
                ))}
            </Stagger>
        </LandingSection>
    );
}