import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

function buildStyles(university) {
  const primary = university.primaryColor || "#1e3a8a";
  const accent = university.secondaryColor || "#d4af37";
  const font = university.fontFamily === "sans" ? "Helvetica" : "Times-Roman";
  const fontBold =
    university.fontFamily === "sans" ? "Helvetica-Bold" : "Times-Bold";

  return StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: font,
      backgroundColor: "#ffffff",
    },
    border: {
      borderWidth: 6,
      borderColor: primary,
      padding: 20,
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      alignItems: "center",
      marginBottom: 10,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: primary,
      color: "#ffffff",
      fontSize: 16,
      fontFamily: fontBold,
      textAlign: "center",
      paddingTop: 15,
      marginBottom: 6,
    },
    uniName: {
      fontSize: 20,
      fontFamily: fontBold,
      color: primary,
      textAlign: "center",
    },
    motto: {
      fontSize: 9,
      fontStyle: "italic",
      color: "#64748b",
      textAlign: "center",
      marginTop: 3,
    },
    address: {
      fontSize: 7,
      color: "#94a3b8",
      textAlign: "center",
      marginTop: 2,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    divider: {
      height: 1.5,
      width: 40,
      backgroundColor: accent,
      marginHorizontal: 10,
    },
    title: {
      fontSize: 15,
      fontFamily: fontBold,
      color: primary,
      letterSpacing: 1.5,
    },
    body: {
      alignItems: "center",
      marginVertical: 8,
    },
    text: {
      fontSize: 11,
      color: "#334155",
      marginBottom: 4,
    },
    studentName: {
      fontSize: 22,
      fontFamily: fontBold,
      color: primary,
      marginVertical: 6,
    },
    enrollment: {
      fontSize: 9,
      color: "#64748b",
      marginBottom: 8,
    },
    degree: {
      fontSize: 15,
      fontFamily: fontBold,
      color: "#0f172a",
      marginTop: 6,
    },
    branch: {
      fontSize: 12,
      color: "#334155",
      marginTop: 3,
    },
    yearLine: {
      fontSize: 11,
      color: "#334155",
      marginTop: 6,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 10,
    },
    footerBlock: {
      width: "30%",
    },
    footerMid: {
      width: "40%",
      alignItems: "center",
    },
    qrImage: {
      width: 70,
      height: 70,
    },
    small: {
      fontSize: 6,
      color: "#64748b",
      marginTop: 2,
    },
    mono: {
      fontSize: 7,
      fontFamily: "Courier",
      color: "#334155",
      marginTop: 1,
    },
    signatureLine: {
      borderTopWidth: 1.5,
      borderColor: primary,
      paddingTop: 4,
      minWidth: 100,
      alignItems: "center",
    },
    registrarName: {
      fontSize: 10,
      fontFamily: fontBold,
      color: primary,
    },
    registrarLabel: {
      fontSize: 7,
      color: "#64748b",
    },
    revokedWatermark: {
      position: "absolute",
      top: 220,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 70,
      fontFamily: fontBold,
      color: "#dc2626",
      opacity: 0.15,
    },
  });
}

export default function CertificateDocument({
  credential,
  university,
  qrDataUrl,
}) {
  const styles = buildStyles(university);
  const isRevoked = credential.status === "REVOKED";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>{university.code}</Text>
            <Text style={styles.uniName}>{university.name}</Text>
            {university.motto ? (
              <Text style={styles.motto}>{university.motto}</Text>
            ) : null}
            {university.address ? (
              <Text style={styles.address}>{university.address}</Text>
            ) : null}
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <View style={styles.divider} />
            <Text style={styles.title}>CERTIFICATE OF DEGREE</Text>
            <View style={styles.divider} />
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.text}>This is to certify that</Text>
            <Text style={styles.studentName}>{credential.studentName}</Text>
            <Text style={styles.enrollment}>
              Enrollment No: {credential.enrollmentNo}
            </Text>
            <Text style={styles.text}>has successfully completed</Text>
            <Text style={styles.degree}>{credential.degree}</Text>
            <Text style={styles.branch}>in {credential.branch}</Text>
            <Text style={styles.yearLine}>
              in the year {credential.yearOfPassing}
              {credential.cgpa ? ` with CGPA ${credential.cgpa}` : ""}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerBlock}>
              {qrDataUrl ? (
                <Image style={styles.qrImage} src={qrDataUrl} />
              ) : null}
              <Text style={styles.small}>Scan to verify</Text>
            </View>

            <View style={styles.footerMid}>
              <Text style={styles.small}>Credential ID</Text>
              <Text style={styles.mono}>{credential.credentialId}</Text>
              <Text style={styles.small}>Hash</Text>
              <Text style={styles.mono}>
                {credential.recordHash.slice(0, 32)}...
              </Text>
              <Text style={styles.small}>
                Issued: {new Date(credential.issuedAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.footerBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.registrarName}>
                  {university.registrarName || "Registrar"}
                </Text>
                <Text style={styles.registrarLabel}>Registrar</Text>
              </View>
            </View>
          </View>

          {/* Revoked watermark */}
          {isRevoked ? (
            <Text style={styles.revokedWatermark} fixed>
              REVOKED
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}