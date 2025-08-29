import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, BookOpen, Users, Award, Rocket, Download, Heart, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import StatsCounter from "../components/StatsCounter";
import TestimonialCard from "../components/TestimonialCard";

const Sobre = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Professora de Matemática",
      rating: 5,
      comment: "Os materiais são incríveis! Economizo horas de preparação e meus alunos adoram as atividades. Recomendo demais!"
    },
    {
      name: "João Santos",
      role: "Coordenador Pedagógico",
      rating: 5,
      comment: "Qualidade excepcional! Comprei vários simulados e apostilas. O suporte é rápido e os materiais são bem estruturados."
    },
    {
      name: "Ana Costa",
      role: "Professora do Ensino Fundamental",
      comment: "Transformou minha forma de ensinar! As atividades são criativas e os alunos ficam mais engajados. Vale cada centavo!",
      rating: 5
    }
  ];

  const services = [
    {
      icon: BookOpen,
      title: "Materiais Didáticos",
      description: "Livros digitais, apostilas e conteúdos educativos de alta qualidade para todos os níveis de ensino.",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Apostilas completas por disciplina",
        "Livros digitais interativos",
        "Conteúdo atualizado regularmente",
        "Formatos PDF e editáveis"
      ]
    },
    {
      icon: Users,
      title: "Atividades Prontas",
      description: "Atividades práticas e simulados prontos para aplicar em sala de aula ou em casa.",
      color: "from-green-500 to-emerald-500",
      features: [
        "Atividades por faixa etária",
        "Exercícios com gabarito",
        "Jogos educativos",
        "Projetos temáticos"
      ]
    },
    {
      icon: Award,
      title: "Simulados e Provas",
      description: "Simulados completos e provas modelo para preparação de exames e avaliações.",
      color: "from-purple-500 to-pink-500",
      features: [
        "Simulados ENEM e vestibulares",
        "Provas por disciplina",
        "Questões comentadas",
        "Cronômetro integrado"
      ]
    },
    {
      icon: Heart,
      title: "Suporte Personalizado",
      description: "Atendimento dedicado e materiais customizados conforme suas necessidades específicas.",
      color: "from-red-500 to-orange-500",
      features: [
        "Atendimento via WhatsApp",
        "Materiais sob medida",
        "Consultoria pedagógica",
        "Suporte técnico 24/7"
      ]
    }
  ];

  const achievements = [
    { icon: Users, text: "Mais de 2.500 professores atendidos" },
    { icon: Download, text: "15.000+ downloads realizados" },
    { icon: BookOpen, text: "850+ materiais disponíveis" },
    { icon: Award, text: "4.9 estrelas de avaliação média" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
          >
            EducaShop Central
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transformando a educação através de materiais didáticos inovadores e soluções pedagógicas personalizadas para professores e educadores.
          </motion.p>
        </motion.div>

        <StatsCounter />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-3xl font-bold text-gray-800 mb-6"
              >
                Nossa Missão
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-gray-600 leading-relaxed mb-6 text-lg"
              >
                Somos uma <span className="font-semibold text-blue-600">loja online especializada</span> em
                materiais educacionais, dedicada a <span className="font-semibold text-purple-600">revolucionar
                  a forma como professores e educadores</span> acessam conteúdos de qualidade.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-gray-600 leading-relaxed mb-8 text-lg"
              >
                Oferecemos <span className="font-semibold text-green-600">livros digitais, apostilas,
                  atividades prontas, simulados</span> e muito mais, tornando o processo de ensino-aprendizagem
                mais <span className="font-semibold text-orange-600">prático, acessível e eficiente</span>.
              </motion.p>

              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quem Sou Eu</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Sou um <span className="font-semibold text-blue-600">profissional apaixonado por educação e tecnologia</span>,
                com anos de experiência criando soluções práticas para professores e escolas.
                Desenvolvo materiais didáticos de alta qualidade, ofereço suporte especializado
                e ajudo na organização de atividades pedagógicas inovadoras.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 italic">
                  "Acredito que a educação de qualidade deve ser acessível a todos.
                  Por isso, trabalho incansavelmente para criar materiais que realmente
                  fazem a diferença na sala de aula."
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluções completas para todas as suas necessidades educacionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">O Que Dizem Nossos Clientes</h2>
            <p className="text-xl text-gray-600">Depoimentos reais de professores satisfeitos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Entre em Contato</h2>
          <p className="text-xl mb-8 opacity-90">
            Estamos aqui para ajudar você a transformar sua prática educacional
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.a
              href="https://www.instagram.com/educashop.central"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram className="w-6 h-6" />
              <span className="font-medium">Instagram</span>
            </motion.a>

            <motion.a
              href="https://www.tiktok.com/@educashop.central"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTiktok className="w-6 h-6" />
              <span className="font-medium">TikTok</span>
            </motion.a>

            <motion.a
              href="mailto:educashopcentral@gmail.com"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6" />
              <span className="font-medium">Email</span>
            </motion.a>

            <motion.a
              href="tel:+5567996610494"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-6 h-6" />
              <span className="font-medium">(67) 99661-0494</span>
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8 pt-8 border-t border-white/20"
          >
            <p className="text-lg opacity-90">
              <span className="font-semibold">EducaShop Central v1.5</span> -
              Sua parceira na jornada educacional
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sobre;