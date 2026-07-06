'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/AlertDialog';

const REFUND_METHODS = ['bank_transfer', 'credit_card', 'stripe', 'other'];

export default function RefundDialog({ order, open, onOpenChange, onSuccess }) {
  const t = useTranslations();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && order) {
      setAmount(order.total ?? '');
      setDate(new Date().toISOString().slice(0, 10));
      setMethod('bank_transfer');
      setReference('');
      setNotes('');
    }
  }, [open, order]);

  if (!order) return null;

  const handleConfirm = async () => {
    if (!amount || !date || !method || !reference) {
      toast.error(t('dashboard.refundMissingFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/orders/${order._id}/refund`, {
        amount: parseFloat(amount),
        date,
        method,
        reference,
        notes
      });

      if (response.data.success) {
        toast.success(t('dashboard.refundRegistered'));
        onSuccess?.(response.data.data);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error registering refund:', error);
      toast.error(t('dashboard.errorRegisteringRefund'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('dashboard.refundDialogTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('dashboard.refundDialogDesc', { orderNumber: order.orderNumber })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="refund-form">
          <div className="refund-form-group">
            <label htmlFor="refund-amount">{t('dashboard.refundAmount')}</label>
            <input
              id="refund-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="refund-form-group">
            <label htmlFor="refund-date">{t('dashboard.refundDate')}</label>
            <input
              id="refund-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="refund-form-group">
            <label htmlFor="refund-method">{t('dashboard.refundMethod')}</label>
            <select
              id="refund-method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {REFUND_METHODS.map((methodOption) => (
                <option key={methodOption} value={methodOption}>
                  {t(`dashboard.refundMethods.${methodOption}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="refund-form-group">
            <label htmlFor="refund-reference">{t('dashboard.refundReference')}</label>
            <input
              id="refund-reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="refund-form-group">
            <label htmlFor="refund-notes">{t('dashboard.refundNotes')}</label>
            <textarea
              id="refund-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </AlertDialogCancel>
          {/* Plain button (not AlertDialogAction) so a failed/invalid submit doesn't
              auto-close the dialog - Radix's AlertDialogAction wraps Dialog.Close */}
          <button
            type="button"
            className="alert-dialog-action"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {t('dashboard.confirmRefund')}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
