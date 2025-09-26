import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCarContext } from '../contexts/CarContext';

interface QuizAnswer {
  budget: string;
  vehicleType: string;
  seating: string;
  fuelType: string;
  commute: string;
  usage: string;
  priority: string[];
  experience: string;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const { setQuizResults } = useCarContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({
    priority: []
  });

  const questions = [
    {
      id: 'budget',
      title: 'What\'s your budget range?',
      subtitle: 'This helps us filter cars within your price range',
      type: 'single',
      options: [
        { value: 'under-5', label: 'Under ₹5 Lakh', description: 'Entry-level vehicles' },
        { value: '5-10', label: '₹5-10 Lakh', description: 'Mid-range options' },
        { value: '10-20', label: '₹10-20 Lakh', description: 'Premium choices' },
        { value: '20-35', label: '₹20-35 Lakh', description: 'Luxury segment' },
        { value: 'above-35', label: 'Above ₹35 Lakh', description: 'Ultra-luxury vehicles' }
      ]
    },
    {
      id: 'vehicleType',
      title: 'What type of vehicle do you prefer?',
      subtitle: 'Different body types offer different advantages',
      type: 'single',
      options: [
        { value: 'hatchback', label: 'Hatchback', description: 'Compact, fuel-efficient, easy parking' },
        { value: 'sedan', label: 'Sedan', description: 'Spacious, comfortable, professional' },
        { value: 'suv', label: 'SUV', description: 'High seating, rugged, versatile' },
        { value: 'pickup', label: 'Pickup Truck', description: 'Utility, hauling capacity' },
        { value: 'convertible', label: 'Convertible', description: 'Style, open-air driving' }
      ]
    },
    {
      id: 'seating',
      title: 'How many people do you typically transport?',
      subtitle: 'This affects the minimum seating capacity we\'ll recommend',
      type: 'single',
      options: [
        { value: '2', label: 'Just me (1-2 people)', description: 'Solo driver or couple' },
        { value: '4', label: 'Small family (3-4 people)', description: 'Perfect for most families' },
        { value: '6', label: 'Large family (5-6 people)', description: 'Extended family needs' },
        { value: '7+', label: '7+ people', description: 'Large groups or commercial use' }
      ]
    },
    {
      id: 'fuelType',
      title: 'What\'s your preferred fuel type?',
      subtitle: 'Each option has different cost and environmental implications',
      type: 'single',
      options: [
        { value: 'petrol', label: 'Petrol', description: 'Lower upfront cost, widely available' },
        { value: 'diesel', label: 'Diesel', description: 'Better mileage, higher torque' },
        { value: 'electric', label: 'Electric', description: 'Zero emissions, low running cost' },
        { value: 'hybrid', label: 'Hybrid', description: 'Best of both worlds' },
        { value: 'any', label: 'No preference', description: 'Show me all options' }
      ]
    },
    {
      id: 'commute',
      title: 'What\'s your daily commute like?',
      subtitle: 'This helps us prioritize fuel efficiency vs performance',
      type: 'single',
      options: [
        { value: 'short', label: 'Short commute (< 20 km)', description: 'Mostly city driving' },
        { value: 'medium', label: 'Medium commute (20-50 km)', description: 'Mixed city and highway' },
        { value: 'long', label: 'Long commute (> 50 km)', description: 'Mostly highway driving' },
        { value: 'weekend', label: 'Weekend driver', description: 'Occasional use only' }
      ]
    },
    {
      id: 'usage',
      title: 'How will you primarily use this vehicle?',
      subtitle: 'Different usage patterns require different features',
      type: 'single',
      options: [
        { value: 'city', label: 'City driving', description: 'Traffic, parking, maneuverability' },
        { value: 'highway', label: 'Highway cruising', description: 'Comfort, stability, efficiency' },
        { value: 'mixed', label: 'Mixed driving', description: 'Balanced city and highway' },
        { value: 'adventure', label: 'Adventure/Off-road', description: 'Ground clearance, 4WD capability' }
      ]
    },
    {
      id: 'priority',
      title: 'What matters most to you? (Select up to 3)',
      subtitle: 'We\'ll weight our recommendations based on your priorities',
      type: 'multiple',
      options: [
        { value: 'price', label: 'Affordable price', description: 'Best value for money' },
        { value: 'economy', label: 'Fuel economy', description: 'Low running costs' },
        { value: 'safety', label: 'Safety features', description: 'Protection and peace of mind' },
        { value: 'performance', label: 'Performance', description: 'Power and driving experience' },
        { value: 'reliability', label: 'Reliability', description: 'Low maintenance, dependable' },
        { value: 'comfort', label: 'Comfort', description: 'Interior space and amenities' },
        { value: 'technology', label: 'Technology', description: 'Latest features and connectivity' },
        { value: 'style', label: 'Style & Design', description: 'Looks and aesthetics' }
      ]
    },
    {
      id: 'experience',
      title: 'What\'s your driving experience?',
      subtitle: 'This helps us recommend appropriate vehicle complexity',
      type: 'single',
      options: [
        { value: 'beginner', label: 'New driver', description: 'Less than 2 years' },
        { value: 'intermediate', label: 'Experienced', description: '2-10 years of driving' },
        { value: 'expert', label: 'Very experienced', description: '10+ years, comfortable with any vehicle' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === 'multiple') {
      const currentPriorities = answers.priority || [];
      if (currentPriorities.includes(value)) {
        setAnswers({
          ...answers,
          priority: currentPriorities.filter(p => p !== value)
        });
      } else if (currentPriorities.length < 3) {
        setAnswers({
          ...answers,
          priority: [...currentPriorities, value]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: value
      });
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id as keyof QuizAnswer];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return Boolean(answer);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed - generate recommendations
      setQuizResults(answers as QuizAnswer);
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id as keyof QuizAnswer];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300/30 rounded-full animate-float delay-500"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-blue-300/30 rounded-full animate-float delay-700"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8 animate-in fade-in duration-700 delay-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {currentQuestion.subtitle}
            </p>
            {currentQuestion.type === 'multiple' && (
              <p className="text-purple-600 text-sm mt-2">
                Selected: {(answers.priority || []).length}/3
              </p>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-in fade-in duration-700 delay-400">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in duration-500 ${
                  isSelected(option.value)
                    ? 'border-purple-600 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  {isSelected(option.value) && (
                    <CheckCircle className="w-6 h-6 text-purple-600 ml-2 flex-shrink-0 animate-in zoom-in-95 duration-200" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between animate-in fade-in duration-700 delay-800">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 transform hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 group ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg transform hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === questions.length - 1 ? 'Get Recommendations' : 'Next'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-1000">
          <p className="text-gray-600">
            💡 <strong>Tip:</strong> Be honest with your answers to get the most accurate recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;