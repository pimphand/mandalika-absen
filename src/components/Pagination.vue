<template>
  <Pagination
    v-slot="{ page }"
    :items-per-page="pagination.per_page"
    :total="pagination.total"
    :default-page="currentPage"
    class="flex items-center justify-center gap-2"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious
        :disabled="!pagination.prev_page_url"
        @click="changePage(currentPage - 1)"
      />

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === currentPage"
          @click="changePage(item.value)"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationEllipsis :index="4" />

      <PaginationNext
        :disabled="!pagination.next_page_url"
        @click="changePage(currentPage + 1)"
      />
    </PaginationContent>
  </Pagination>
</template>

<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Pagination {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const props = defineProps<{
  pagination: Pagination;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: "page-changed", page: number): void;
}>();

const changePage = (page: number | string) => {
  if (typeof page === "string" && page.startsWith("http")) {
    const url = new URL(page);
    const pageNumber = url.searchParams.get("page");
    if (pageNumber) {
      emit("page-changed", parseInt(pageNumber));
    }
  } else if (typeof page === "number") {
    emit("page-changed", page);
  }
};
</script>
