<template>
  <DashboardLayout>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Daftar Absensi</h1>
      </div>

      <DataTable :columns="columns" :items="absenList">
        <template #attendance_date="{ item }">
          {{ formatDate(item.attendance_date) }}
        </template>
        <template #user="{ item }">
          <div class="flex flex-col">
            <span class="font-medium">{{ item.user.name }}</span>
            <span class="text-sm text-gray-500">{{
              item.user.roles[0].name
            }}</span>
          </div>
        </template>
        <template #status_check_in="{ item }">
          <span :class="getStatusClass(item.status_check_in)">
            {{ item.status_check_in }}
          </span>
        </template>
        <template #status_check_out="{ item }">
          <span :class="getStatusClass(item.status_check_out || 'Belum')">
            {{ item.status_check_out || "Belum" }}
          </span>
        </template>
        <template #location="{ item }">
          <a
            v-if="item.latitude_check_in && item.longitude_check_in"
            :href="`https://www.google.com/maps?q=${item.latitude_check_in},${item.longitude_check_in}`"
            target="_blank"
            class="text-blue-600 hover:text-blue-800"
          >
            Lihat Lokasi
          </a>
          <span v-else>-</span>
        </template>
      </DataTable>

      <Pagination
        :pagination="pagination"
        :current-page="currentPage"
        @page-changed="fetchAbsenList"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { http } from "@/utils/http";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DataTable from "@/components/DataTable.vue";
import Pagination from "@/components/Pagination.vue";

interface Absen {
  id: string;
  attendance_date: string;
  check_in: string;
  check_out: string | null;
  latitude_check_in: string | null;
  longitude_check_in: string | null;
  latitude_check_out: string | null;
  longitude_check_out: string | null;
  distance_check_in: number | null;
  distance_check_out: number | null;
  photo_check_in: string | null;
  photo_check_out: string | null;
  status_check_in: string;
  status_check_out: string | null;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    is_active: number;
    phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    number_id: string | null;
    photo: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    target_sales: number;
    achieved_sales: number;
    omzet_items: number;
  };
}

interface Pagination {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface AbsenResponse {
  message: string;
  data: {
    data: Absen[];
  } & Pagination;
}

const columns = [
  { key: "attendance_date", label: "Tanggal" },
  { key: "user", label: "Nama" },
  { key: "check_in", label: "Jam Masuk" },
  { key: "status_check_in", label: "Status Masuk" },
  { key: "check_out", label: "Jam Keluar" },
  { key: "status_check_out", label: "Status Keluar" },
  { key: "location", label: "Lokasi" },
];

const absenList = ref<Absen[]>([]);
const pagination = ref<Pagination>({
  current_page: 1,
  first_page_url: "",
  from: 0,
  last_page: 1,
  last_page_url: "",
  links: [],
  next_page_url: null,
  path: "",
  per_page: 10,
  prev_page_url: null,
  to: 0,
  total: 0,
});
const currentPage = ref(1);

const fetchAbsenList = async (page = 1) => {
  try {
    const response = await http.get(`/admin/absen?page=${page}`);
    const data = response as AbsenResponse;
    absenList.value = data.data.data;
    pagination.value = {
      current_page: data.data.current_page,
      first_page_url: data.data.first_page_url,
      from: data.data.from,
      last_page: data.data.last_page,
      last_page_url: data.data.last_page_url,
      links: data.data.links,
      next_page_url: data.data.next_page_url,
      path: data.data.path,
      per_page: data.data.per_page,
      prev_page_url: data.data.prev_page_url,
      to: data.data.to,
      total: data.data.total,
    };
    currentPage.value = page;
  } catch (error) {
    console.error("Error fetching absen list:", error);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusClass = (status: string) => {
  const classes = {
    "Sudah Absen": "bg-green-100 text-green-800",
    Terlambat: "bg-yellow-100 text-yellow-800",
    Izin: "bg-blue-100 text-blue-800",
    Sakit: "bg-purple-100 text-purple-800",
    Alpha: "bg-red-100 text-red-800",
    Belum: "bg-gray-100 text-gray-800",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${
    classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800"
  }`;
};

onMounted(() => {
  fetchAbsenList();
});
</script>
