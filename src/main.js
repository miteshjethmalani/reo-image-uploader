import { createApp } from "vue";
import { Button, Modal, Menu, PageHeader } from "ant-design-vue";
import VueAxios from "vue-axios";
import axios from "axios";
import {
  FolderOutlined,
  FileOutlined,
  ArrowLeftOutlined,
  RightOutlined,
  CheckCircleFilled,
} from "@ant-design/icons-vue";
import App from "./App.vue";

const app = createApp(App);

app.config.productionTip = false;
app.use(Button);
app.use(Modal);
app.use(Menu);
app.use(PageHeader);
app.component("icon-folder", FolderOutlined);
app.component("icon-file", FileOutlined);
app.component("arrow-left", ArrowLeftOutlined);
app.component("right-outlined", RightOutlined);
app.component("check-circle-filled", CheckCircleFilled);
app.use(VueAxios, axios);

app.mount("#app");
