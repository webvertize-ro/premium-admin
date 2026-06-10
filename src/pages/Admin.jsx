// pages/Admin.jsx
import { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import EditContentModal from "../components/EditContentModal";
import LoadingSpinner from "../components/LoadingSpinner";
import styled from "styled-components";
import { c } from "../utils/content";
import { pageLabels, sectionLabels } from "../utils/labels";

const SpinnerContainer = styled.div`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AdminLayout = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: calc(100vh - 64px - 41px);
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: rgba(11, 34, 64, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(168, 212, 245, 0.1);
  padding: 1.25rem 0.75rem;
  gap: 0.25rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 240px;
    z-index: 150;
    padding-top: 5rem;
    background: rgba(11, 34, 64, 0.97);
    border-right: 1px solid rgba(168, 212, 245, 0.12);
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.25s ease;
  }
`;

const SidebarOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 149;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  bottom: 5rem;
  right: 1.25rem;
  z-index: 200;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: rgba(11, 34, 64, 0.9);
  backdrop-filter: blur(8px);
  color: #a8d4f5;
  font-size: 1.2rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SidebarItem = styled.div`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  background: ${({ $selected }) =>
    $selected ? "rgba(168, 212, 245, 0.14)" : "transparent"};
  color: ${({ $selected }) =>
    $selected ? "#fff" : "rgba(168, 212, 245, 0.5)"};

  &:hover {
    background: rgba(168, 212, 245, 0.08);
    color: rgba(168, 212, 245, 0.9);
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  color: #fff;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  position: ${({ $isScrolled }) => ($isScrolled ? "fixed" : "absolute")};
  top: 64px;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(11, 34, 64, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(168, 212, 245, 0.12);
  z-index: 100;
  padding: 0.75rem 1.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.6rem 0.75rem;
    flex-wrap: wrap;
  }
`;

const ContentContainer = styled.div`
  padding-top: 120px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding-top: 100px;
  }
`;

const PageHeading = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.5);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(168, 212, 245, 0.1);
`;

const IndividualTab = styled.div`
  padding: 0.4rem 1rem;
  border-radius: 6px;
  flex: 1;
  max-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  background: ${({ $selected }) =>
    $selected ? "rgba(168, 212, 245, 0.18)" : "transparent"};
  color: ${({ $selected }) =>
    $selected ? "#fff" : "rgba(168, 212, 245, 0.55)"};
  border: 1px solid
    ${({ $selected }) =>
      $selected ? "rgba(168, 212, 245, 0.35)" : "transparent"};

  &:hover {
    background: rgba(168, 212, 245, 0.1);
    color: rgba(168, 212, 245, 0.9);
  }

  @media (max-width: 768px) {
    flex: unset;
    font-size: 0.72rem;
    padding: 0.35rem 0.75rem;
  }
`;

const Page = styled.div`
  padding: 2rem;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div``;

const SectionTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
  padding: 0.5rem 0 0.4rem 0;
  margin-bottom: 0;
`;

const FieldsContainer = styled.div`
  border: 1px solid rgba(168, 212, 245, 0.12);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: rgba(15, 47, 90, 0.4);
`;

const Field = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(168, 212, 245, 0.07);
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(168, 212, 245, 0.04);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const FieldContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(168, 212, 245, 0.45);
`;

const Content = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
`;

const EditButton = styled.button`
  flex-shrink: 0;
  padding: 0.35rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(168, 212, 245, 0.3);
  background: transparent;
  color: rgba(168, 212, 245, 0.8);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(168, 212, 245, 0.12);
    color: #fff;
    border-color: rgba(168, 212, 245, 0.55);
  }

  &:active {
    background: rgba(168, 212, 245, 0.2);
  }

  @media (max-width: 600px) {
    align-self: flex-start;
  }
`;

const PdfLink = styled.a`
  color: #a8d4f5;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyValue = styled.span`
  color: rgba(168, 212, 245, 0.3);
  font-style: italic;
  font-size: 0.85rem;
`;

const StyledImg = styled.img`
  max-width: 80px;
`;

function Admin() {
  const { grouped, isLoading } = useContent();
  const [selectedPage, setSelectedPage] = useState("global");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("page");
    if (saved) setSelectedPage(saved);
  }, []);

  function handleSelectedTab(page) {
    setSelectedPage(page);
    localStorage.setItem("page", page);
  }

  const [editingField, setEditingField] = useState(null);

  const pages = Object.entries(grouped).map(([page]) => page);

  return (
    <>
      <AdminLayout>
        <SidebarOverlay
          $open={sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar $open={sidebarOpen}>
          {pages.map((p) => (
            <SidebarItem
              key={p}
              $selected={p === selectedPage}
              onClick={() => {
                handleSelectedTab(p);
                setSidebarOpen(false);
              }}
            >
              {pageLabels[p]}
            </SidebarItem>
          ))}
        </Sidebar>

        <MainContent>
          {isLoading ? (
            <SpinnerContainer>
              <LoadingSpinner />
            </SpinnerContainer>
          ) : (
            <>
              <PageHeading>Administrare conținut</PageHeading>

              {Object.entries(grouped).map(([page, sections]) => {
                if (page !== selectedPage) return null;

                return (
                  <Page key={page}>
                    <SectionsContainer>
                      {Object.entries(sections).map(([section, fields]) => (
                        <Section key={section}>
                          <SectionTitle>{sectionLabels[section]}</SectionTitle>
                          <FieldsContainer>
                            {fields.map((field) => (
                              <Field key={field.id}>
                                <FieldContent>
                                  <Label>{field.label}</Label>
                                  <Content>
                                    {field.content_type === "image_url" ? (
                                      <StyledImg
                                        src={field.value}
                                        alt={field.label}
                                      />
                                    ) : field.content_type === "pdf_url" ? (
                                      field.value ? (
                                        <PdfLink
                                          href={field.value}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Vizualizează PDF
                                        </PdfLink>
                                      ) : (
                                        <EmptyValue>
                                          Niciun fișier încărcat
                                        </EmptyValue>
                                      )
                                    ) : field.content_type === "social_link" ? (
                                      (() => {
                                        try {
                                          const parsed = JSON.parse(
                                            field.value,
                                          );
                                          return `${parsed.platform} — ${parsed.url}`;
                                        } catch {
                                          return field.value;
                                        }
                                      })()
                                    ) : field.value ? (
                                      field.value
                                    ) : (
                                      <EmptyValue>—</EmptyValue>
                                    )}
                                  </Content>
                                </FieldContent>
                                <EditButton
                                  onClick={() => setEditingField(field)}
                                >
                                  Editează
                                </EditButton>
                              </Field>
                            ))}
                          </FieldsContainer>
                        </Section>
                      ))}
                    </SectionsContainer>
                  </Page>
                );
              })}
            </>
          )}
        </MainContent>

        {editingField && (
          <EditContentModal
            field={editingField}
            onClose={() => setEditingField(null)}
          />
        )}
      </AdminLayout>
      <MobileMenuButton onClick={() => setSidebarOpen((prev) => !prev)}>
        {sidebarOpen ? "✕" : "☰"}
      </MobileMenuButton>
    </>
  );
}

export default Admin;
