'use client'
import { useState } from 'react'
import { Sun, Leaf, Zap, Shield, ChevronDown, ChevronUp, Battery, Wrench } from 'lucide-react'

interface ServiceCard {
    id: number
    title: string
    subtitle: string
    description: string
    icon: React.ReactNode
    benefits: string[]
}

const Services = () => {
    const [expandedCard, setExpandedCard] = useState<number | null>(null)

    const serviceCards: ServiceCard[] = [
        {
            id: 1,
            title: "Diagnose",
            subtitle: "Battery Condition Analysis",
            description: "DIAGNOSE the condition of the battery when it arrives as 'new', before and after corrective action and when in service to ensure it's in peak condition using Battery Analyzer.",
            icon: <Battery className="w-8 h-8" />,
            benefits: [
                "Advanced battery condition analysis",
                "Pre-service and post-service evaluation",
                "Peak condition monitoring",
                "Professional battery analyzer technology"
            ]
        },
        {
            id: 2,
            title: "Correct",
            subtitle: "Battery Recovery & Restoration",
            description: "CORRECT batteries that are low in capacity using the Recover chargers. 70% of dead batteries can be returned to better than new condition saving time and money.",
            icon: <Wrench className="w-8 h-8" />,
            benefits: [
                "70% battery recovery rate",
                "Better than new condition restoration",
                "Advanced recovery charger technology",
                "Significant cost and time savings"
            ]
        },
        {
            id: 3,
            title: "Prevent / Migrate",
            subtitle: "Long-term Battery Protection",
            description: "To keep batteries in peak condition while installed on vehicles or equipment use Solar pulse charger. Prevent problems and extend battery life up to three times by installing desulfators on vehicles during routine maintenance.",
            icon: <Shield className="w-8 h-8" />,
            benefits: [
                "Up to 3x battery life extension",
                "Solar pulse charger technology",
                "Desulfator installation during maintenance",
                "Proactive problem prevention"
            ]
        }
    ]

    // Battery Maintenance Management Benefits Data
    const batteryBenefits = [
        {
            icon: <Zap className="w-8 h-8 text-primary mb-2" />,
            title: "Up to 3x Battery Life",
            description: "Extends battery life up to 3 times"
        },
        {
            icon: <Battery className="w-8 h-8 text-primary mb-2" />,
            title: "70% Recovery Rate",
            description: "Recovers 70% of spent batteries"
        },
        {
            icon: <ChevronUp className="w-8 h-8 text-primary mb-2" />,
            title: "Reduces Jump Starts",
            description: "Dramatically reduces jump starts"
        },
        {
            icon: <Wrench className="w-8 h-8 text-primary mb-2" />,
            title: "Extends Alternator Life",
            description: "Extends alternator and starter life"
        },
        {
            icon: <Leaf className="w-8 h-8 text-primary mb-2" />,
            title: "Supports Sustainability",
            description: "Supports sustainability goals"
        },
        {
            icon: <Battery className="w-8 h-8 text-primary mb-2" />,
            title: "Fewer Purchases",
            description: "Reduces the number of batteries purchased"
        },
        {
            icon: <Wrench className="w-8 h-8 text-primary mb-2" />,
            title: "Less Maintenance",
            description: "Reduces maintenance man hours"
        },
        {
            icon: <Shield className="w-8 h-8 text-primary mb-2" />,
            title: "Less Downtime",
            description: "Reduces vehicle downtime"
        },
    ]

    const handleCardClick = (cardId: number) => {
        setExpandedCard(expandedCard === cardId ? null : cardId)
    }

    return (
        <section id="services" className="relative py-20 overflow-hidden">
            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <div className="text-center mb-12">
                    <p className="text-emerald-700 text-base font-semibold uppercase flex gap-2.5 items-center justify-center tracking-widest">
                        <Sun className="text-3xl text-yellow-400 animate-pulse" />
                        Solar & Energy Solutions
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Empowering a Greener Tomorrow</h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Innovative battery maintenance and solar energy solutions to maximize efficiency, sustainability, and savings for your business or home.</p>
                </div>
                {/* Battery Maintenance Management Benefits */}
                <div className="mb-12">
                    <div className="rounded-3xl shadow-lg p-8 max-w-5xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 drop-shadow-lg text-center mb-6 flex items-center justify-center gap-2">
                            <Battery className="inline-block w-7 h-7 text-primary" />
                            Battery Maintenance Management Benefits
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {batteryBenefits.map((benefit, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-4">
                                    {benefit.icon}
                                    <span className="font-semibold text-gray-900">{benefit.title}</span>
                                    <span className="text-sm text-gray-600">{benefit.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Benefits Grid */}
                <div className="mb-16">
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-yellow-100 p-8 max-w-6xl mx-auto">
                        <h3 className="text-3xl font-bold text-emerald-800 text-center mb-8">
                            Why Choose Our Energy Solutions?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-white rounded-2xl shadow-md">
                                <div className="flex justify-center mb-2"><Zap className="text-yellow-500 w-10 h-10" /></div>
                                <div className="text-lg font-semibold text-gray-900 mb-2">Up to 3x Battery Life</div>
                                <div className="text-sm text-gray-600">Extend battery lifespan with advanced tech</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-white rounded-2xl shadow-md">
                                <div className="flex justify-center mb-2"><Battery className="text-green-600 w-10 h-10" /></div>
                                <div className="text-lg font-semibold text-gray-900 mb-2">70% Recovery Rate</div>
                                <div className="text-sm text-gray-600">Restore spent batteries, save resources</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-white rounded-2xl shadow-md">
                                <div className="flex justify-center mb-2"><Shield className="text-orange-500 w-10 h-10" /></div>
                                <div className="text-lg font-semibold text-gray-900 mb-2">Reduced Downtime</div>
                                <div className="text-sm text-gray-600">Minimize jump starts and vehicle downtime</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-white rounded-2xl shadow-md">
                                <div className="flex justify-center mb-2"><Leaf className="text-emerald-600 w-10 h-10" /></div>
                                <div className="text-lg font-semibold text-gray-900 mb-2">Eco-Friendly Impact</div>
                                <div className="text-sm text-gray-600">Support sustainability and reduce waste</div>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="text-2xl text-center font-semibold text-emerald-700 mb-4">
                    Our 3-Step Battery Maintenance Program
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    A comprehensive approach to optimize your battery performance and extend lifespan, powered by solar and smart energy solutions.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {serviceCards.map((card) => (
                        <div
                            key={card.id}
                            className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-primary/20 transition-all duration-500 ease-in-out cursor-pointer hover:shadow-2xl ${expandedCard === card.id
                                ? 'ring-2 ring-primary shadow-2xl scale-105'
                                : 'hover:ring-2 hover:ring-primary/60'
                                }`}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <div className="p-7">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-full text-white shadow-lg">
                                            {card.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-primary">
                                                    {card.id}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {card.title}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {card.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-gray-500">
                                        {expandedCard === card.id ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </div>
                                </div>
                                {/* Card Description */}
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {card.description}
                                    </p>
                                </div>
                                {/* Expanded Content */}
                                {expandedCard === card.id && (
                                    <div className="border-t border-primary/10 pt-4 mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                            Key Benefits:
                                        </h4>
                                        <div className="grid gap-2">
                                            {card.benefits.map((benefit, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                                    <span className="text-xs text-gray-700">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services