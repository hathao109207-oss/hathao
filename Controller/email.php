<?php
require_once __DIR__ . '/../Model/email_service.php';

/**
 * Send payment confirmation email after admin approves payment.
 * Returns true on success, false on failure (never throws).
 */
function sendPaymentConfirmationEmail($orderId) {
    $orderId = (int)$orderId;
    if ($orderId <= 0) return false;

    try {
        $order = HoaDon::find($orderId);
        if (!$order) {
            error_log('[email] Order #' . $orderId . ' not found');
            return false;
        }

        $txn = PaymentManager::getTransactionByOrder($orderId);
        if (!$txn) {
            error_log('[email] No payment transaction for order #' . $orderId);
            return false;
        }

        $items = HoaDon::items($orderId);

        // Parse snack items from customer_note
        $parsed = HoaDon::parseCustomerNote($order['customer_note'] ?? '');
        $snackItems = $parsed['snack_items'] ?? [];

        return EmailService::sendPaymentConfirmation($order, $txn, $items, $snackItems);
    } catch (Throwable $e) {
        error_log('[email] Exception sending payment confirmation for order #' . $orderId . ': ' . $e->getMessage());
        return false;
    }
}
?>