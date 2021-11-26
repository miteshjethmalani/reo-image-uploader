<template>
  <a-button type="primary" @click="uploadClick"> Upload Files </a-button>
  <modal
    v-if="dataLoaded"
    :showModal="showModal"
    :fileList="fileList"
    @uploadClick="uploadClick"
  />

  <template :key="file.id" v-for="file in selectedFiles">
    <div class="text-ellipsis" v-html="file.name"></div>
  </template>
</template>
<script>
import Modal from "./Modal.vue";

export default {
  name: "UploadFile",
  data() {
    return {
      fileList: [],
      selectedFiles: [],
      dataLoaded: false,
      showModal: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    uploadClick(data) {
      this.showModal = !this.showModal;
      if (this.showModal) {
        this.axios
          .get("https://api-dev.reo.so/api/folderStructure")
          .then((response) => {
            this.dataLoaded = true;
            this.fileList = response.data;
          });
      } else {
        this.selectedFiles = Object.values(data);
      }
    },
  },
};
</script>
<style>
.text-ellipsis {
  width: 329px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
