<template>
  <a-modal
    :visible="showModal"
    :retain-focus="false"
    @cancel="handleClose"
    @close="handleClose"
    footer=""
  >
    <a-page-header
      style="height: 70px"
      :title="modalTitle"
      @back="() => onBackClick()"
    />
    <div class="modal-body-scroll">
      <a-menu mode="vertical" v-bind="fileList">
        <template v-if="filteredPath.folders.length">
          <a-menu-item
            v-for="file in filteredPath.folders"
            :key="file.id"
            @click="handleFolderClick"
          >
            <icon-folder class="image-size" />
            <span>{{ file.name }}</span>
            <span class="float-right"><right-outlined /></span>
          </a-menu-item>
        </template>
        <template v-for="file in filteredPath.files">
          <a-menu-item
            :key="file.id"
            v-if="
              file.mimeType === 'image/png' ||
              file.mimeType === 'image/jpeg' ||
              file.mimeType === 'application/pdf'
            "
            @click="handleFileClick"
          >
            <img :srcset="file.url" class="image-size anticon border-rounded" />
            <span>{{ file.name }}</span>
            <span class="float-right" v-if="selectedFiles[file.id] != undefined"
              ><check-circle-filled class="blue-color"
            /></span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
    <div class="text-right">
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
        :disabled="isButtonDisable"
      >
        {{ selectedFilesText }}
      </a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: "filemodal",
  data() {
    return {
      loading: false,
      visible: true,
      modalTitle: "",
      currentFolder: {},
      structureList: this.fileList,
      selectedFiles: {},
      selectedFilesText: "Select files",
      isButtonDisable: true,
    };
  },
  computed: {
    filteredPath() {
      let output;
      if (!this.currentFolder.id) {
        output = this.structureList;
      } else {
        this.findFileInStructure(this.structureList);
        output = this.currentFolder;
      }
      return output;
    },
  },
  props: ["showModal", "fileList"],
  methods: {
    findFileInStructure(filteredobj) {
      filteredobj.folders.forEach((obj) => {
        if (obj.id === this.currentFolder.id) {
          this.currentFolder = obj;
          this.modalTitle = this.currentFolder.name;
        } else {
          this.findFileInStructure(obj);
        }
      });
    },
    onBackClick() {
      if (this.currentFolder && this.currentFolder.parentFolderId) {
        this.currentFolder = {
          id: this.currentFolder.parentFolderId,
        };
        this.findFileInStructure(this.structureList);
      } else {
        this.currentFolder = this.structureList;
        this.modalTitle = "";
      }
      return null;
    },
    handleFolderClick(e) {
      const currentMenuId = e.currentTarget.getAttribute("data-menu-id");
      if (this.modalTitle) {
        this.currentFolder = this.currentFolder.folders.find(
          (obj) => obj.id === currentMenuId
        );
      } else {
        this.currentFolder = this.structureList.folders.find(
          (obj) => obj.id === currentMenuId
        );
      }
      this.modalTitle = this.currentFolder.name;
    },
    handleFileClick(e) {
      const currentFileId = e.currentTarget.getAttribute("data-menu-id");
      if (this.selectedFiles[currentFileId]) {
        delete this.selectedFiles[currentFileId];
      } else {
        let selctedFileData;
        if (this.currentFolder.files) {
          selctedFileData = this.currentFolder.files.find((obj) => {
            return obj.id === currentFileId;
          });
        } else {
          selctedFileData = this.structureList.files.find((obj) => {
            return obj.id === currentFileId;
          });
        }

        this.selectedFiles[currentFileId] = selctedFileData;
      }
      const numberofFiles = Object.keys(this.selectedFiles).length;
      if (numberofFiles > 0) {
        this.selectedFilesText = `Select ${numberofFiles} files`;
        this.isButtonDisable = false;
      } else {
        this.selectedFilesText = "Select files";
        this.isButtonDisable = true;
      }
    },
    showModalChange() {
      this.visible = true;
    },
    handleOk() {
      this.$emit("uploadClick", this.selectedFiles);
    },
    handleClose() {
      this.selectedFiles = {};
      this.selectedFilesText = "Select files";
      this.isButtonDisable = true;
      this.$emit("uploadClick", this.selectedFiles);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style>
.float-right {
  float: right;
}
.text-right {
  text-align: right;
}
.blue-color {
  color: blue;
}
.image-size {
  height: 30px;
  width: 30px;
}
.border-rounded {
  border-radius: 25%;
}
.modal-body-scroll {
  overflow: auto;
  height: 200px;
}
</style>
