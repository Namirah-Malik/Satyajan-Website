import { Icon } from '@iconify/react';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ: React.FC = () => {
    return (
        <section id='faqs'>
            <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                <div className="grid lg:grid-cols-2 gap-10 ">
                    <div className='lg:mx-0 mx-auto rounded-2xl overflow-hidden'>
                        <Image
                            src="/images/faqs/faq-image.jpg"
                            alt='image'
                            width={680}
                            height={644}
                            className='lg:w-full'
                            unoptimized={true}
                        />
                    </div>
                    <div className='lg:px-12'>
                        <p className="text-dark/75 text-base font-semibold flex gap-2">
                            <Icon icon="ph:solar-panel" className="text-2xl text-primary " />
                            FAQs
                        </p>
                        <h2 className='lg:text-52 text-40 leading-[1.2] font-medium text-dark'>
                            Everything about Solar Products
                        </h2>
                        <p className='text-dark/50 pr-20'>
                            We know that choosing the right solar products can be overwhelming. Here are some frequently asked questions to help guide you through the process of selecting, installing, and maintaining solar solutions for your home or business.
                        </p>
                        <div className="my-8">
                            <Accordion type="single" defaultValue="item-1" collapsible className="w-full flex flex-col gap-6">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>1. What services does Satyajan Energy Solutions offer?</AccordionTrigger>
                                    <AccordionContent>
                                        We provide solar panels, UPS systems, and battery solutions for homes and businesses. Our team handles everything from consultation to installation and maintenance.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>2. How much can I save on electricity bills with solar?</AccordionTrigger>
                                    <AccordionContent>
                                        Most customers save 70-90% on their monthly electricity bills. The exact savings depend on your current usage and system size.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>3. How long do solar panels last?</AccordionTrigger>
                                    <AccordionContent>
                                        Our solar panels work efficiently for 25+ years with minimal maintenance. They come with performance warranties to guarantee long-term reliability.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>4. How do I know what solar system size I need?</AccordionTrigger>
                                    <AccordionContent>
                                        Our engineers visit your property, check your electricity bills, and design a system that matches your energy needs and roof space.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
