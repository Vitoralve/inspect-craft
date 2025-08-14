import React, { useState } from 'react';
import { FormVersion, FormField } from '../../types/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Camera, 
  Calendar, 
  Clock, 
  Mic, 
  Paperclip, 
  CheckCircle, 
  X,
  Send,
  Save,
  Wifi,
  WifiOff,
  Signal,
  Battery
} from 'lucide-react';

interface PhoneSimulatorProps {
  form: FormVersion;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ form }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isOffline, setIsOffline] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'Este campo é obrigatório';
      }
      
      if (field.validation && formData[field.id]) {
        const value = formData[field.id];
        if (field.validation.min && value.length < field.validation.min) {
          newErrors[field.id] = `Mínimo de ${field.validation.min} caracteres`;
        }
        if (field.validation.max && value.length > field.validation.max) {
          newErrors[field.id] = `Máximo de ${field.validation.max} caracteres`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Simulate submission
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
  };

  const calculateProgress = () => {
    const totalFields = form.fields.filter(f => f.type !== 'instruction').length;
    const completedFields = form.fields.filter(f => 
      f.type !== 'instruction' && formData[f.id]
    ).length;
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const hasError = !!errors[field.id];

    // Check conditional logic
    if (field.conditionalLogic) {
      const dependentValue = formData[field.conditionalLogic.dependsOn];
      const shouldShow = field.conditionalLogic.condition === 'equals' 
        ? dependentValue === field.conditionalLogic.value
        : dependentValue !== field.conditionalLogic.value;
      
      if (!shouldShow) return null;
    }

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Input
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={hasError ? 'border-destructive' : ''}
            />
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'rich_text':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={`min-h-20 ${hasError ? 'border-destructive' : ''}`}
            />
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'yes_no':
        return (
          <div key={field.id} className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="flex gap-3">
              <Button
                variant={value === 'yes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFieldChange(field.id, 'yes')}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Sim
              </Button>
              <Button
                variant={value === 'no' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFieldChange(field.id, 'no')}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Não
              </Button>
            </div>
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'select':
        const options = field.options || ['OK', 'Ajustar', 'Crítico'];
        return (
          <div key={field.id} className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <Button
                  key={option}
                  variant={value === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFieldChange(field.id, option)}
                  className="w-full justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'photo':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Button
              variant="outline"
              className="w-full h-24 border-dashed"
              onClick={() => handleFieldChange(field.id, 'photo_captured')}
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {value ? 'Foto capturada' : 'Capturar foto'}
                </span>
              </div>
            </Button>
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'signature':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg h-32 flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <div className="text-muted-foreground text-sm">
                  {value ? 'Assinatura capturada' : 'Toque para assinar'}
                </div>
              </div>
            </div>
            {!value && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFieldChange(field.id, 'signature_captured')}
              >
                Capturar Assinatura
              </Button>
            )}
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        );

      case 'instruction':
        return (
          <div key={field.id} className="p-4 bg-primary-light/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">{field.label}</p>
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
              Campo {field.type} (em desenvolvimento)
            </div>
          </div>
        );
    }
  };

  const progress = calculateProgress();
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="w-80 h-[640px] bg-phone-bg rounded-[2.5rem] p-2 shadow-xl">
        {/* Phone Bezel */}
        <div className="w-full h-full bg-phone-bezel rounded-[2rem] p-1">
          {/* Screen */}
          <div className="w-full h-full bg-phone-screen rounded-[1.5rem] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="h-8 bg-background px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">9:41</span>
              </div>
              <div className="flex items-center gap-1">
                {isOffline ? (
                  <WifiOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Wifi className="w-4 h-4" />
                )}
                <Signal className="w-4 h-4" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App Header */}
            <div className="bg-card border-b border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-foreground truncate">
                  {form.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOffline(!isOffline)}
                  className="text-xs p-1 h-auto"
                >
                  {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                </Button>
              </div>
              
              {form.fields.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {form.fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-muted-foreground text-sm">
                    Formulário vazio
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Adicione campos para visualizar
                  </div>
                </div>
              ) : (
                form.fields.map(renderField)
              )}
            </div>

            {/* Action Buttons */}
            {form.fields.length > 0 && (
              <div className="border-t border-border p-4 space-y-2 bg-card">
                {isOffline && (
                  <div className="text-xs text-accent-foreground bg-accent/10 p-2 rounded text-center">
                    Modo offline - dados serão enviados quando conectar
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Rascunho
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={hasErrors}
                    className="flex-1 bg-gradient-to-r from-success to-success-light"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};