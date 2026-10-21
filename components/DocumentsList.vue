<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { PilotDocumentItem } from '~/types/api'

defineProps<{
  documents: PilotDocumentItem[]
}>()

const STATUS_LABELS: Record<PilotDocumentItem['status'], string> = {
  safe: 'Safe',
  soon: 'Expiring soon',
  expired: 'Expired',
}

function daysLabel(doc: PilotDocumentItem): string {
  if (doc.daysRemaining < 0) return `Expired ${Math.abs(doc.daysRemaining)} d ago`
  if (doc.daysRemaining === 0) return 'Expires today'
  return `${doc.daysRemaining} d left`
}
</script>

<template>
  <ul class="documents-list">
    <li v-for="doc in documents" :key="doc.id" class="document-item">
      <span class="doc-icon"><FileText :size="18" /></span>
      <div class="doc-info">
        <p class="doc-label">{{ doc.label }}</p>
        <p class="doc-expiry">
          {{ formatDisplayDate(doc.expiryDate) }}
          <span class="dot-sep">·</span>
          <span :class="`days-${doc.status}`">{{ daysLabel(doc) }}</span>
        </p>
      </div>
      <span class="badge" :class="`badge-${doc.status}`">{{ STATUS_LABELS[doc.status] }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.documents-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #f0f1f4;

  &:last-child {
    border-bottom: none;
    padding-bottom: 4px;
  }

  &:first-child {
    padding-top: 4px;
  }
}

.doc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #f5f6f8;
  color: #0e2138;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-label {
  font-size: 14px;
  font-weight: 600;
  color: #0e2138;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-expiry {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.dot-sep {
  margin: 0 2px;
}

.days-safe {
  color: #0d9668;
  font-weight: 600;
}

.days-soon {
  color: #b45309;
  font-weight: 600;
}

.days-expired {
  color: #e63757;
  font-weight: 600;
}
</style>
