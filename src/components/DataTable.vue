<template>
  <Table class="gap-[-3]">
    <TableCaption v-if="caption">{{ caption }}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead
          v-for="column in columns"
          :key="column.key"
          :class="column.class"
        >
          {{ column.label }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(item, index) in items" :key="item.id || index">
        <TableCell
          v-for="column in columns"
          :key="column.key"
          :class="column.class"
          class="text-sm text-muted-foreground dark:text-muted-foreground py-2"
        >
          <slot :name="column.key" :item="item">
            {{ item[column.key] }}
          </slot>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Column {
  key: string;
  label: string;
  class?: string;
}

defineProps<{
  columns: Column[];
  items: any[];
  caption?: string;
}>();
</script>
