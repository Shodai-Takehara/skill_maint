'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, FileText, Settings, Wrench, Shield } from 'lucide-react';

import { Button } from '@shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import { Badge } from '@shared/ui/badge';

const templateSchema = z.object({
  name: z.string().min(1, 'テンプレート名は必須です'),
  description: z.string().min(1, '説明は必須です'),
  category: z.string().min(1, 'カテゴリーは必須です'),
  equipmentTypes: z.array(z.string()).min(1, '対象設備は1つ以上選択してください'),
  estimatedDuration: z.number().min(1, '予想時間は1分以上で入力してください'),
  priority: z.enum(['low', 'medium', 'high']),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface CreateTemplateModalProps {
  onTemplateCreate: (template: TemplateFormData) => void;
}

const categories = [
  { value: 'safety', label: '安全点検', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'maintenance', label: '保守点検', icon: Wrench, color: 'bg-blue-100 text-blue-800' },
  { value: 'quality', label: '品質管理', icon: Settings, color: 'bg-green-100 text-green-800' },
  { value: 'operation', label: '運転確認', icon: FileText, color: 'bg-purple-100 text-purple-800' },
];

const equipmentTypes = [
  'CNCフライス盤',
  'CNC旋盤',
  'プレス機',
  '溶接機',
  'コンベア',
  '油圧機器',
  '空圧機器',
  'ロボット',
  '測定器',
  'その他',
];

const priorities = [
  { value: 'low', label: '低', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: '高', color: 'bg-red-100 text-red-800' },
];

export function CreateTemplateModal({ onTemplateCreate }: CreateTemplateModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedEquipmentTypes, setSelectedEquipmentTypes] = useState<string[]>([]);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      equipmentTypes: [],
      estimatedDuration: 15,
      priority: 'medium',
    },
  });

  const onSubmit = (data: TemplateFormData) => {
    onTemplateCreate({
      ...data,
      equipmentTypes: selectedEquipmentTypes,
    });
    setOpen(false);
    form.reset();
    setSelectedEquipmentTypes([]);
  };

  const handleEquipmentTypeToggle = (equipmentType: string) => {
    setSelectedEquipmentTypes(prev => {
      const newTypes = prev.includes(equipmentType)
        ? prev.filter(type => type !== equipmentType)
        : [...prev, equipmentType];
      form.setValue('equipmentTypes', newTypes);
      return newTypes;
    });
  };

  const selectedCategory = categories.find(cat => cat.value === form.watch('category'));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          新規テンプレート作成
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            新規点検テンプレート作成
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            設備の点検項目を定義するテンプレートを作成します。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                基本情報
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      テンプレート名 *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: CNC日常点検"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      説明 *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="このテンプレートの目的や内容を説明してください"
                        className="min-h-[80px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        カテゴリー *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="カテゴリーを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <category.icon className="h-4 w-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        優先度
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="優先度を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <Badge className={priority.color}>
                                {priority.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      予想実施時間（分）
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="480"
                        className="h-12 text-base"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      このテンプレートの点検にかかる予想時間を分単位で入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 対象設備 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                対象設備タイプ
              </h3>
              
              <FormField
                control={form.control}
                name="equipmentTypes"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      適用可能な設備タイプ *
                    </FormLabel>
                    <FormDescription>
                      このテンプレートを使用できる設備タイプを選択してください（複数選択可）
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {equipmentTypes.map((equipmentType) => (
                        <div
                          key={equipmentType}
                          className={`
                            p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                            ${selectedEquipmentTypes.includes(equipmentType)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                          onClick={() => handleEquipmentTypeToggle(equipmentType)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center
                              ${selectedEquipmentTypes.includes(equipmentType)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                              }
                            `}>
                              {selectedEquipmentTypes.includes(equipmentType) && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-sm font-medium">{equipmentType}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* プレビュー */}
            {(form.watch('name') || selectedCategory) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  プレビュー
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {form.watch('name') || 'テンプレート名'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {form.watch('description') || '説明'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedCategory && (
                        <Badge className={selectedCategory.color}>
                          <selectedCategory.icon className="h-3 w-3 mr-1" />
                          {selectedCategory.label}
                        </Badge>
                      )}
                      <Badge className="bg-gray-100 text-gray-800">
                        {form.watch('estimatedDuration') || 15}分
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedEquipmentTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedEquipmentTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                disabled={!form.formState.isValid}
              >
                テンプレートを作成
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}