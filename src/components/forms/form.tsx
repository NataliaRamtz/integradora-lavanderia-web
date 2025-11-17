'use client';

import * as React from 'react';
import type { FieldPath, FieldValues, FormState, UseFormReturn } from 'react-hook-form';
import {
  FormProvider,
  Controller,
  type ControllerProps,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export const Form = <TFieldValues extends FieldValues>({
  form,
  children,
}: {
  form: UseFormReturn<TFieldValues>;
  children: React.ReactNode;
}) => <FormProvider {...form}>{children}</FormProvider>;

export const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  render,
}: ControllerProps<TFieldValues, TName>) => (
  <Controller control={control} name={name} render={render} />
);

export const FormItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props} />
);

export const FormLabel = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Label>) => (
  <Label className={cn('flex items-center justify-between', className)} {...props}>
    {children}
  </Label>
);

export const FormControl = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(className)} {...props} />
);

export const FormMessage = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) =>
  children ? (
    <p className={cn('text-sm text-rose-400', className)} {...props}>
      {children}
    </p>
  ) : null;

export const formHasError = <TFieldValues extends FieldValues>(
  formState: FormState<TFieldValues>,
  name: FieldPath<TFieldValues>
) => {
  const fieldError = formState.errors[name];
  return Boolean(fieldError);
};

