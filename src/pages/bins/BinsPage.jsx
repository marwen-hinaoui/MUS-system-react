import { useState, useEffect } from "react";
import { get_bins_api } from "../../api/get_bins_api";
import { useSelector } from "react-redux";
import { Select, Button, Card, Row, Col, Space, notification } from "antd";
import { assign_bin_project_api } from "../../api/assign_bin_project_api";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { RiEdit2Fill } from "react-icons/ri";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { get_projet_api } from "../../api/get_projet_api";

const { Option } = Select;

const PROJECT_COLORS = {
  MBEAM: "#d4edffff",
  "N-CAR": "#9ad0fcff",
  "D-CROSS": "#58adfcff",
  "773W": "#1f7ce0ff",
};

export default function BinsPage() {
  const [bins, setBins] = useState([]);
  const [projets, setProjets] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [project, setProject] = useState("");
  const [editing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.app.tokenValue);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchBins();
    getProjets();
  }, []);

  const fetchBins = async () => {
    const res = await get_bins_api(token);
    if (res.resData) {
      setBins(res.resData);
      console.log(res.resData);
    }
  };
  const getProjets = async () => {
    try {
      const res = await get_projet_api();
      if (res.resData) {
        console.log(res.resData);
        setProjets(res.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetRange = () => {
    setSelectedRange([]);
    setHoverIndex(null);
  };

  const handleBinClick = (idx) => {
    if (!editing) return;

    if (selectedRange.length === 0) {
      setSelectedRange([idx]);
    } else if (selectedRange.length === 1) {
      if (selectedRange[0] === idx) {
        setSelectedRange([idx]);
      } else {
        const [start] = selectedRange;
        const end = idx;
        setSelectedRange([Math.min(start, end), Math.max(start, end)]);
      }
      setHoverIndex(null);
    } else {
      setSelectedRange([idx]);
      setHoverIndex(null);
    }
  };

  const handleBinHover = (idx) => {
    if (editing && selectedRange.length === 1) {
      setHoverIndex(idx);
    }
  };

  const handleAssign = async () => {
    if (!project) {
      openNotification(api, "Veuillez sélectionner un projet");
      return;
    }
    if (selectedRange.length !== 2) {
      openNotification(api, "Veuillez sélectionner bins");
      return;
    }
    setLoading(true);

    const [startIdx, endIdx] = selectedRange;
    const resAssign = await assign_bin_project_api(
      project,
      bins[startIdx].main_bin,
      bins[endIdx].main_bin,
      token
    );

    if (resAssign.resData) {
      openNotificationSuccess(api, "Bins affectés avec succès");
    }

    await fetchBins();
    resetRange();
    setEditing(false);
    setLoading(false);
    setProject("");
  };

  const handleCancel = () => {
    resetRange();
    setEditing(false);
  };
  const projectRanges = Object.entries(
    bins.reduce((acc, bin, idx) => {
      if (bin.project) {
        if (!acc[bin.project]) acc[bin.project] = [];
        acc[bin.project].push({ idx, main_bin: bin.main_bin });
      }
      return acc;
    }, {})
  ).map(([projectName, projectBins]) => {
    projectBins.sort((a, b) => a.idx - b.idx);
    const start = projectBins[0].main_bin;
    const end = projectBins[projectBins.length - 1].main_bin;
    return { projectName, start, end };
  });
  return (
    <div className="dashboard">
      <div style={{ padding: "0 0 16px 0" }}>
        <h4 style={{ margin: 0 }}>Paramètre Bins</h4>
      </div>
      {contextHolder}

      {!editing ? (
        <div style={{ paddingBottom: "16px" }}>
          <Button
            color="danger"
            variant="outlined"
            icon={<RiEdit2Fill size={ICONSIZE.SMALL} />}
            onClick={() => setEditing(true)}
          >
            Modifier les Bins
          </Button>
        </div>
      ) : (
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Select Project"
            value={project || undefined}
            onChange={(value) => setProject(value)}
            style={{ width: 150 }}
          >
            {projets.map((item, index) => (
              <Option key={index} value={item.nom}>
                {item.nom}
              </Option>
            ))}
          </Select>

          <Button loading={isLoading} type="primary" onClick={handleAssign}>
            Enregistrer
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Space>
      )}

      {bins.length > 0 ? (
        <div>
          <Row gutter={[13, 8]}>
            {bins.map((bin, idx) => {
              let backgroundColor = PROJECT_COLORS[bin.project] || "#fff";
              let color = COLORS.BLACK;
              if (editing && selectedRange.length > 0) {
                const [start, end] = selectedRange;

                if (selectedRange.length === 1 && hoverIndex !== null) {
                  const min = Math.min(selectedRange[0], hoverIndex);
                  const max = Math.max(selectedRange[0], hoverIndex);
                  if (idx >= min && idx <= max) {
                    backgroundColor = "#fff1f0";
                    if (idx === min || idx === max) {
                      backgroundColor = COLORS.LearRed;
                      color = COLORS.WHITE;
                    }
                  }
                } else if (selectedRange.length === 2) {
                  if (idx >= start && idx <= end) {
                    backgroundColor = "#fff1f0";
                    if (idx === start || idx === end) {
                      color = COLORS.WHITE;

                      backgroundColor = COLORS.LearRed;
                    }
                  }
                }
              }

              return (
                <Col key={bin.main_bin} span={2}>
                  <Card
                    onClick={() => handleBinClick(idx)}
                    onMouseEnter={() => handleBinHover(idx)}
                    style={{
                      borderRadius: "4px",
                      textAlign: "center",
                      backgroundColor,
                      cursor: editing ? "pointer" : "default",
                      padding: "4px",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <p style={{ margin: 0, color }}>{bin.main_bin}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div style={{ padding: "14px 0" }}>
            {projectRanges.map((proj) => (
              <p key={proj.projectName}>
                <b>{proj.projectName}</b>: {proj.start} {"->"} {proj.end}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p>Aucune donnée trouvée</p>
      )}
    </div>
  );
}
