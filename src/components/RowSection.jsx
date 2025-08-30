import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Importar os módulos do Swiper corretamente
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RowSection = () => {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
                delay: 6000, // 3 segundos entre slides
                disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
            }}
        >
            <SwiperSlide>
                <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 md:py-32 flex justify-center items-center overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.h2
                            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Desvende o Conhecimento
                        </motion.h2>

                        <motion.p
                            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Sua jornada para o aprendizado começa aqui. Materiais de estudo de alta qualidade para todos os níveis.
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <Link
                                to="/products"
                                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
                            >
                                Explorar Produtos
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </SwiperSlide>
            <SwiperSlide>
                <section className="relative bg-gradient-to-br from-green-500 to-teal-600 text-white py-20 md:py-32 flex justify-center items-center overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.h2
                            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            EducaHub Está Por Vir!
                        </motion.h2>

                        <motion.p
                            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Estamos preparando conteúdos incríveis para você. Fique ligado para novidades e materiais exclusivos que vão transformar seu aprendizado.
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <Link
                                to="/coming-soon"
                                className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
                            >
                                Saiba Mais
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

            </SwiperSlide>
        </Swiper>
    );
};

export default RowSection;
